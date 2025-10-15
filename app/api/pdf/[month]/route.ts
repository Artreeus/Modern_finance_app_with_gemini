import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import MonthlySummary from '@/models/MonthlySummary';
import User from '@/models/User';
import { parseMonthParam, getMonthName, paisaToBdt } from '@/lib/utils';
import { renderToStream } from '@react-pdf/renderer';
import { MonthlyReportPDF } from '@/components/pdf/MonthlyReportPDF';

// GET /api/pdf/:month - Generate PDF for a specific month
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

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get summary
    const summary = await MonthlySummary.findOne({ userId, year, month });

    // Get transactions
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const transactions = await Transaction.find({
      userId,
      occurredAt: { $gte: startDate, $lte: endDate },
    }).sort({ occurredAt: -1 });

    // Prepare data
    const data = {
      user: {
        name: user.name,
        email: user.email,
      },
      month: getMonthName(month),
      year,
      summary: summary
        ? {
            totalIncome: paisaToBdt(summary.totalIncome),
            totalExpense: paisaToBdt(summary.totalExpense),
            netSavings: paisaToBdt(summary.netSavings),
            breakdown: Object.entries(summary.breakdown).map(([cat, amt]) => ({
              category: cat,
              amount: paisaToBdt(amt as number),
            })),
          }
        : null,
      transactions: transactions.map((txn) => ({
        date: txn.occurredAt.toISOString(),
        type: txn.type,
        category: txn.category,
        amount: paisaToBdt(txn.amount),
        note: txn.note,
      })),
    };

    // Generate PDF
    const stream = await renderToStream(<MonthlyReportPDF data={data} />);

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="finance-report-${year}-${String(month).padStart(2, '0')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

