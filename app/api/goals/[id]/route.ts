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
        const { 
            name, 
            description, 
            category, 
            priority, 
            status, 
            targetAmount, 
            currentAmount, 
            deadline 
        } = body;

        const goal = await Goal.findOne({ _id: params.id, userId: user._id });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        // Update basic fields
        if (name !== undefined) goal.name = name;
        if (description !== undefined) goal.description = description;
        if (category !== undefined) goal.category = category;
        if (priority !== undefined) goal.priority = priority;
        if (status !== undefined) goal.status = status;
        if (deadline !== undefined) goal.targetDate = deadline ? new Date(deadline) : undefined;
        
        // Update amounts and recalculate milestones if needed
        let needsRecalculation = false;
        
        if (targetAmount !== undefined && targetAmount !== goal.targetAmount) {
            goal.targetAmount = targetAmount; // Don't round, use as-is
            needsRecalculation = true;
        }
        
        if (currentAmount !== undefined) {
            goal.currentAmount = currentAmount; // Don't round, use as-is
            needsRecalculation = true;
        }
        
        // Recalculate milestones if target or current amount changed
        if (needsRecalculation) {
            // Update milestone amounts based on new target
            goal.milestones = [
                { percentage: 25, amount: goal.targetAmount * 0.25, achieved: false },
                { percentage: 50, amount: goal.targetAmount * 0.50, achieved: false },
                { percentage: 75, amount: goal.targetAmount * 0.75, achieved: false },
                { percentage: 100, amount: goal.targetAmount, achieved: false },
            ];
            
            // Update milestone achievement status
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
