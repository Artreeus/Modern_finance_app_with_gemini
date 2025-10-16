import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

// GET /api/admin/stats - Admin dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // Total users
    const totalUsers = await User.countDocuments();

    // Active users this month (users with transactions this month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeUserIds = await Transaction.distinct('userId', {
      occurredAt: { $gte: startOfMonth },
    });
    const activeUsersThisMonth = activeUserIds.length;

    // Profession distribution
    const professionPipeline = await User.aggregate([
      { $match: { profession: { $ne: '' } } },
      { $group: { _id: '$profession', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const professionDistribution = professionPipeline.map((p) => ({
      profession: p._id,
      count: p.count,
    }));

    // Top expense categories (all time)
    const categoryPipeline = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    const topExpenseCategories = categoryPipeline.map((c) => ({
      category: c._id,
      total: c.total,
      count: c.count,
    }));

    // New users this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsersThisMonth,
        newUsersThisMonth,
        professionDistribution,
        topExpenseCategories,
      },
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

