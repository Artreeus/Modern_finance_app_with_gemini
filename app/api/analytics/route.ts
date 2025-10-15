import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// GET /api/analytics - Get analytics data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month'; // week, month, year

    const now = new Date();
    let startDate: Date;

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get all transactions in range
    const transactions = await Transaction.find({
      userId,
      occurredAt: { $gte: startDate, $lte: now },
    }).sort({ occurredAt: 1 });

    // Calculate category distribution
    const categoryData: Record<string, number> = {};
    transactions.forEach((txn) => {
      if (txn.type === 'expense') {
        categoryData[txn.category] = (categoryData[txn.category] || 0) + txn.amount;
      }
    });

    const categoryArray = Object.entries(categoryData)
      .map(([name, value]) => ({
        name,
        value,
        percentage: 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const totalExpense = categoryArray.reduce((sum, cat) => sum + cat.value, 0);
    categoryArray.forEach((cat) => {
      cat.percentage = totalExpense > 0 ? Math.round((cat.value / totalExpense) * 100) : 0;
    });

    // Calculate monthly trends (last 6 months)
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthTransactions = await Transaction.find({
        userId,
        occurredAt: { $gte: monthDate, $lte: monthEnd },
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      trendData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expense,
        savings: income - expense,
      });
    }

    // Calculate stats
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthTransactions = await Transaction.find({
      userId,
      occurredAt: { $gte: currentMonthStart },
    });

    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenseValue = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenseValue;
    
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const avgDailySpend = totalExpenseValue / daysInMonth;

    // Month-over-month comparison (current vs previous month)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthTransactions = await Transaction.find({
      userId,
      occurredAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const comparisonData: Record<string, { lastMonth: number; thisMonth: number }> = {};
    
    lastMonthTransactions.forEach((txn) => {
      if (txn.type === 'expense') {
        if (!comparisonData[txn.category]) {
          comparisonData[txn.category] = { lastMonth: 0, thisMonth: 0 };
        }
        comparisonData[txn.category].lastMonth += txn.amount;
      }
    });

    currentMonthTransactions.forEach((txn) => {
      if (txn.type === 'expense') {
        if (!comparisonData[txn.category]) {
          comparisonData[txn.category] = { lastMonth: 0, thisMonth: 0 };
        }
        comparisonData[txn.category].thisMonth += txn.amount;
      }
    });

    const comparisonArray = Object.entries(comparisonData)
      .map(([category, data]) => ({
        category,
        ...data,
      }))
      .sort((a, b) => b.thisMonth - a.thisMonth)
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalIncome,
        totalExpense: totalExpenseValue,
        netSavings,
        avgDailySpend,
      },
      categoryData: categoryArray,
      trendData,
      comparisonData: comparisonArray,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

