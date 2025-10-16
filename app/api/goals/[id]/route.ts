import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';
import User from '@/models/User';

// GET single goal
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

        const goal = await Goal.findOne({ _id: params.id, userId: user._id });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json({ goal });
    } catch (error) {
        console.error('Goal fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
    }
}

// PATCH update goal
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
        const { currentAmount, ...updateData } = body;

        const goal = await Goal.findOne({ _id: params.id, userId: user._id });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        // Update fields
        Object.assign(goal, updateData);

        // If updating current amount, also update milestones
        if (currentAmount !== undefined) {
            goal.currentAmount = Math.round(currentAmount);
            goal.updateMilestones();
            
            // Auto-complete goal if target reached
            if (goal.currentAmount >= goal.targetAmount) {
                goal.status = 'completed';
            }
        }

        await goal.save();

        return NextResponse.json({ goal });
    } catch (error) {
        console.error('Goal update error:', error);
        return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }
}

// DELETE goal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

        const goal = await Goal.findOneAndDelete({ _id: params.id, userId: user._id });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Goal deletion error:', error);
        return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
    }
}
