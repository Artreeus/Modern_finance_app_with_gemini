'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    Target, 
    Plus, 
    Edit2, 
    Trash2, 
    TrendingUp, 
    Calendar,
    DollarSign,
    Award,
    CheckCircle2,
    ArrowLeft,
    Home
} from 'lucide-react';
import AddGoalModal from '@/components/AddGoalModal';
import toast, { Toaster } from 'react-hot-toast';

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

        const loadingToast = toast.loading('Deleting goal...');
        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setGoals(goals.filter(g => g._id !== id));
                toast.dismiss(loadingToast);
                toast.success('Goal deleted successfully!');
            } else {
                toast.dismiss(loadingToast);
                toast.error('Failed to delete goal');
            }
        } catch (error) {
            console.error('Failed to delete goal:', error);
            toast.dismiss(loadingToast);
            toast.error('Network error');
        }
    };

    const updateProgress = async (id: string, amount: number) => {
        const loadingToast = toast.loading('Updating goal...');
        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentAmount: amount }),
            });

            if (response.ok) {
                await fetchGoals();
                toast.dismiss(loadingToast);
                toast.success('Goal updated successfully!');
            } else {
                toast.dismiss(loadingToast);
                toast.error('Failed to update goal');
            }
        } catch (error) {
            console.error('Failed to update goal:', error);
            toast.dismiss(loadingToast);
            toast.error('Network error');
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
            high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800',
            medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800',
            low: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800',
        };
        return colors[priority] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800';
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
                <div className="max-w-7xl mx-auto">
                    {/* Back Navigation */}
                    <div className="mb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Goals</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track and achieve your financial milestones</p>
                    </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {['all', 'active', 'completed', 'paused'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === f
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Add Goal Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mb-6 flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add New Goal
                </button>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-dark-700">
                        <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start by creating your first financial goal</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
                                    className="bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-dark-700"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                                {getCategoryIcon(goal.category)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                                                    {goal.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${goal.currentAmount.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                of ${goal.targetAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Milestones */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Milestones</p>
                                        <div className="flex gap-1">
                                            {goal.milestones.map((m, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex-1 h-2 rounded ${
                                                        m.achieved ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-200 dark:bg-dark-700'
                                                    }`}
                                                    title={`${m.percentage}% - $${m.amount.toLocaleString()}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Deadline */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="font-medium">Completed!</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-dark-700">
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
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Update
                                        </button>
                                        <button
                                            onClick={() => deleteGoal(goal._id)}
                                            className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-100 dark:border-red-800"
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
        </>
    );
}
