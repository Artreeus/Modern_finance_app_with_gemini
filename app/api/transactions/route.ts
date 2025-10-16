import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { z } from 'zod';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  note: z.string().optional(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  occurredAt: z.string().optional(),
  meta: z.record(z.any()).optional(),
});

// GET /api/transactions - List transactions with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // YYYY-MM format
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');

    const userId = (session.user as any).id;
    const query: any = { userId };

    // Filter by month
    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);
      query.occurredAt = { $gte: startDate, $lte: endDate };
    }

    // Filter by type
    if (type && ['income', 'expense', 'transfer'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const transactions = await Transaction.find(query)
      .sort({ occurredAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Transaction.countDocuments(query);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + transactions.length < total,
      },
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const validation = transactionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = (session.user as any).id;
    const transactionData = {
      ...validation.data,
      userId,
      occurredAt: validation.data.occurredAt ? new Date(validation.data.occurredAt) : new Date(),
    };

    const transaction = await Transaction.create(transactionData);

    return NextResponse.json(
      { message: 'Transaction created', transaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

