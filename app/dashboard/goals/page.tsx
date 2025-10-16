'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    Target, 
    Plus, 
    Edit2, 
    Trash2, 
    TrendingUp, 
    Calendar,
    DollarSign,
    Award,
    CheckCircle2
} from 'lucide-react';
import AddGoalModal from '@/components/AddGoalModal';

interface Milestone {
    percentage: number;
    amount: number;
    achieved: boolean;
    achievedAt?: Date;
}

interface Goal {
    _id: string;
    name: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    status: 'active' | 'completed' | 'paused';
    priority: 'low' | 'medium' | 'high';
    milestones: Milestone[];
    createdAt: string;
}

export default function GoalsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchGoals();
        }
    }, [status, filter]);

    const fetchGoals = async () => {
        try {
            const url = filter === 'all' 
                ? '/api/goals' 
                : `/api/goals?status=${filter}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setGoals(data.goals);
            }
        } catch (error) {
            console.error('Failed to fetch goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteGoal = async (id: string) => {
        if (!confirm('Are you sure you want to delete this goal?')) return;

        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setGoals(goals.filter(g => g._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete goal:', error);
        }
    };

    const updateProgress = async (id: string, amount: number) => {
        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentAmount: amount }),
            });

            if (response.ok) {
                fetchGoals();
            }
        } catch (error) {
            console.error('Failed to update goal:', error);
        }
    };

    const getProgressPercentage = (goal: Goal) => {
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    };

    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const end = new Date(deadline);
        const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: JSX.Element } = {
            savings: <DollarSign className="w-5 h-5" />,
            investment: <TrendingUp className="w-5 h-5" />,
            debt: <Target className="w-5 h-5" />,
            emergency: <Award className="w-5 h-5" />,
            vacation: <Calendar className="w-5 h-5" />,
        };
        return icons[category] || <Target className="w-5 h-5" />;
    };

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            high: 'text-red-500 bg-red-50',
            medium: 'text-yellow-500 bg-yellow-50',
            low: 'text-green-500 bg-green-50',
        };
        return colors[priority] || 'text-gray-500 bg-gray-50';
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Goals</h1>
                    <p className="text-gray-600">Track and achieve your financial milestones</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {['all', 'active', 'completed', 'paused'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Add Goal Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mb-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Goal
                </button>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals yet</h3>
                        <p className="text-gray-600 mb-6">Start by creating your first financial goal</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Goal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => {
                            const progress = getProgressPercentage(goal);
                            const daysLeft = getDaysRemaining(goal.deadline);

                            return (
                                <div
                                    key={goal._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                {getCategoryIcon(goal.category)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                                                    {goal.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold text-gray-900">{progress.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${goal.currentAmount.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                of ${goal.targetAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Milestones */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-600 mb-2">Milestones</p>
                                        <div className="flex gap-1">
                                            {goal.milestones.map((m, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex-1 h-2 rounded ${
                                                        m.achieved ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}
                                                    title={`${m.percentage}% - $${m.amount.toLocaleString()}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Deadline */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {daysLeft > 0
                                                ? `${daysLeft} days remaining`
                                                : daysLeft === 0
                                                ? 'Due today'
                                                : `${Math.abs(daysLeft)} days overdue`}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    {goal.status === 'completed' && (
                                        <div className="flex items-center gap-2 text-green-600 mb-4">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="font-medium">Completed!</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                const amount = prompt(
                                                    'Enter new amount:',
                                                    goal.currentAmount.toString()
                                                );
                                                if (amount) {
                                                    updateProgress(goal._id, parseFloat(amount));
                                                }
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Update
                                        </button>
                                        <button
                                            onClick={() => deleteGoal(goal._id)}
                                            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Goal Modal */}
            <AddGoalModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchGoals}
            />
        </div>
    );
}
