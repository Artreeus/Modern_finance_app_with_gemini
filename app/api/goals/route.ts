import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';
import User from '@/models/User';

// GET all goals for the current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');

        const query: any = { userId: user._id };
        if (status) query.status = status;
        if (category) query.category = category;

        const goals = await Goal.find(query).sort({ priority: -1, createdAt: -1 });

        return NextResponse.json({ goals });
    } catch (error) {
        console.error('Goals fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }
}

// POST create a new goal
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { name, description, targetAmount, currentAmount, category, priority, deadline } = body;

        if (!name || !targetAmount) {
            return NextResponse.json(
                { error: 'Name and target amount are required' },
                { status: 400 }
            );
        }

        // Create default milestones (25%, 50%, 75%, 100%)
        const milestones = [
            { percentage: 25, achieved: false, amount: targetAmount * 0.25 },
            { percentage: 50, achieved: false, amount: targetAmount * 0.50 },
            { percentage: 75, achieved: false, amount: targetAmount * 0.75 },
            { percentage: 100, achieved: false, amount: targetAmount },
        ];

        const goal = await Goal.create({
            userId: user._id,
            name,
            description,
            targetAmount: targetAmount, // Don't convert, use as-is
            currentAmount: currentAmount || 0, // Don't convert, use as-is
            category: category || 'savings',
            priority: priority || 'medium',
            targetDate: deadline ? new Date(deadline) : undefined,
            status: 'active',
            milestones,
        });

        return NextResponse.json({ goal }, { status: 201 });
    } catch (error) {
        console.error('Goal creation error:', error);
        return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
    }
}
