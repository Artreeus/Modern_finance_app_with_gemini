import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Goal from '@/models/Goal';
import Budget from '@/models/Budget';
import { calculateFinancialHealthScore } from '@/lib/financialHealthScore';

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Get current month's data
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get user's transactions for the current month
        const transactions = await Transaction.find({
            // @ts-ignore
            userId: session.user.id,
            occurredAt: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        });

        // Calculate income and expenses
        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const savingsAmount = totalIncome - totalExpense;

        // Get user's goals
        const goals = await Goal.find({
            // @ts-ignore
            userId: session.user.id,
            status: 'active',
        });

        // Calculate average goals progress
        let goalsProgress = 0;
        if (goals.length > 0) {
            const totalProgress = goals.reduce((sum, goal) => {
                const progress = goal.targetAmount > 0 
                    ? (goal.currentAmount / goal.targetAmount) * 100 
                    : 0;
                return sum + Math.min(progress, 100);
            }, 0);
            goalsProgress = totalProgress / goals.length;
        }

        // Get active budget
        const activeBudget = await Budget.findOne({
            // @ts-ignore
            userId: session.user.id,
            status: 'active',
            startDate: { $lte: now },
            endDate: { $gte: now },
        });

        // Calculate budget adherence
        let budgetAdherence = 50; // Default neutral score
        if (activeBudget && activeBudget.totalBudget > 0) {
            const usagePercentage = (activeBudget.totalSpent / activeBudget.totalBudget) * 100;
            
            // Perfect adherence is 80-95% usage
            if (usagePercentage >= 80 && usagePercentage <= 95) {
                budgetAdherence = 100;
            } else if (usagePercentage < 80) {
                // Under-spending is also tracked
                budgetAdherence = 70 + (usagePercentage / 80) * 30;
            } else {
                // Over-spending penalty
                budgetAdherence = Math.max(100 - (usagePercentage - 95) * 2, 0);
            }
        }

        // For now, assume no debt (can be added later with debt tracking)
        const debtAmount = 0;

        // Emergency fund - assume it's a specific savings goal or 0
        const emergencyGoal = goals.find(g => g.category === 'emergency');
        const emergencyFund = emergencyGoal?.currentAmount || 0;

        // Transaction count for consistency
        const transactionCount = transactions.length;

        // Calculate health score
        const healthScore = calculateFinancialHealthScore({
            totalIncome,
            totalExpense,
            savingsAmount,
            budgetAdherence,
            goalsProgress,
            debtAmount,
            emergencyFund,
            transactionCount,
        });

        return NextResponse.json({
            healthScore,
            metrics: {
                totalIncome,
                totalExpense,
                savingsAmount,
                budgetAdherence,
                goalsProgress,
                debtAmount,
                emergencyFund,
                transactionCount,
            },
        });
    } catch (error) {
        console.error('Health score calculation error:', error);
        return NextResponse.json(
            { error: 'Failed to calculate health score' },
            { status: 500 }
        );
    }
}
