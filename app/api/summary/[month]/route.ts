import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import MonthlySummary from '@/models/MonthlySummary';
import { parseMonthParam } from '@/lib/utils';

// GET /api/summary/:month - Get monthly summary
export async function GET(
  req: NextRequest,
  { params }: { params: { month: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = parseMonthParam(params.month);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { year, month } = parsed;

    // Try to find existing summary
    let summary = await MonthlySummary.findOne({ userId, year, month });

    // If not found, generate on-the-fly
    if (!summary) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const transactions = await Transaction.find({
        userId,
        occurredAt: { $gte: startDate, $lte: endDate },
      });

      let totalIncome = 0;
      let totalExpense = 0;
      const breakdown: Record<string, number> = {};

      transactions.forEach((txn) => {
        if (txn.type === 'income') {
          totalIncome += txn.amount;
        } else if (txn.type === 'expense') {
          totalExpense += txn.amount;
        }

        // Category breakdown
        if (txn.category) {
          breakdown[txn.category] = (breakdown[txn.category] || 0) + txn.amount;
        }
      });

      const netSavings = totalIncome - totalExpense;

      // Create summary for future use
      summary = await MonthlySummary.create({
        userId,
        year,
        month,
        totalIncome,
        totalExpense,
        netSavings,
        breakdown,
      });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Failed to fetch summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}

