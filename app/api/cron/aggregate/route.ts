import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import MonthlySummary from '@/models/MonthlySummary';
import User from '@/models/User';

// GET /api/cron/aggregate - Aggregate monthly summaries for all users
// Called by Vercel Cron on 1st of every month at 2 AM
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get previous month
    const now = new Date();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 12 : now.getMonth();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all users
    const users = await User.find({}).select('_id');

    let processed = 0;
    let errors = 0;

    for (const user of users) {
      try {
        const userId = user._id;

        // Check if summary already exists
        const existing = await MonthlySummary.findOne({ userId, year, month });
        if (existing) {
          continue; // Skip if already processed
        }

        // Aggregate transactions
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

          if (txn.category) {
            breakdown[txn.category] = (breakdown[txn.category] || 0) + txn.amount;
          }
        });

        const netSavings = totalIncome - totalExpense;

        // Create summary
        await MonthlySummary.create({
          userId,
          year,
          month,
          totalIncome,
          totalExpense,
          netSavings,
          breakdown,
        });

        processed++;
      } catch (error) {
        console.error(`Failed to process user ${user._id}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      message: 'Aggregation complete',
      year,
      month,
      processed,
      errors,
      total: users.length,
    });
  } catch (error) {
    console.error('Cron aggregation failed:', error);
    return NextResponse.json(
      { error: 'Aggregation failed' },
      { status: 500 }
    );
  }
}

