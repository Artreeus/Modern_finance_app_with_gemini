'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowLeft, AlertCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AnalyticsClient() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/analytics?range=${timeRange}`);
                if (res.ok) {
                    const analyticsData = await res.json();
                    setData(analyticsData);
                } else {
                    setError('Failed to load analytics data');
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Analytics</h2>
                    <p className="text-gray-600 mb-6">{error || 'No data available'}</p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = data?.stats || { totalIncome: 0, totalExpense: 0, netSavings: 0, avgDailySpend: 0 };
    const categoryData = data?.categoryData || [];
    const trendData = data?.trendData || [];
    const comparisonData = data?.comparisonData || [];

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-950 dark:to-dark-900 transition-colors">
                {/* Header */}
                <header className="bg-white dark:bg-dark-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-dark-700 transition-colors">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    <ArrowLeft size={24} />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
                            </div>

                        <div className="flex gap-2">
                            {(['week', 'month', 'year'] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === range
                                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 border border-gray-200 dark:border-dark-600'
                                        }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Income"
                        value={formatCurrency(stats.totalIncome)}
                        trend="up"
                        icon={<DollarSign />}
                        delay={0}
                    />
                    <StatsCard
                        title="Total Expense"
                        value={formatCurrency(stats.totalExpense)}
                        trend="up"
                        icon={<DollarSign />}
                        delay={0.1}
                    />
                    <StatsCard
                        title="Net Savings"
                        value={formatCurrency(stats.netSavings)}
                        trend={stats.netSavings >= 0 ? "up" : "down"}
                        icon={<TrendingUp />}
                        delay={0.2}
                    />
                    <StatsCard
                        title="Avg Daily Spend"
                        value={formatCurrency(stats.avgDailySpend)}
                        trend="down"
                        icon={<Calendar />}
                        delay={0.3}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Income vs Expense Trend */}
                    <Card hover delay={0.4}>
                        <div className="p-6 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 transition-colors">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Income vs Expense Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
                                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                                    <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Category Distribution */}
                    <Card hover delay={0.5}>
                        <div className="p-6 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 transition-colors">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Expense Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name} ${percentage}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Category Comparison */}
                <Card delay={0.6}>
                    <div className="p-6 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Month-over-Month Comparison</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="lastMonth" fill="#94a3b8" name="Last Month" />
                                <Bar dataKey="thisMonth" fill="#22c55e" name="This Month" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Insights */}
                {categoryData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <InsightCard
                            title="🎯 Top Spending Category"
                            description={`${categoryData[0]?.name || 'No data'} expenses are ${categoryData[0]?.percentage || 0}% of your total budget`}
                            color="bg-green-50 border-green-200"
                        />
                        <InsightCard
                            title="📈 Savings Rate"
                            description={`You ${stats.netSavings >= 0 ? 'saved' : 'overspent by'} ${formatCurrency(Math.abs(stats.netSavings))} this month`}
                            color="bg-blue-50 border-blue-200"
                        />
                        {comparisonData.length > 0 && comparisonData[0].thisMonth > comparisonData[0].lastMonth && (
                            <InsightCard
                                title="⚠️ Budget Alert"
                                description={`${comparisonData[0].category} costs increased from last month`}
                                color="bg-orange-50 border-orange-200"
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </div>
        </>
    );
}

function StatsCard({
    title,
    value,
    trend,
    icon,
    delay,
}: {
    title: string;
    value: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-dark-700 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    {icon}
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </motion.div>
    );
}

function InsightCard({ title, description, color }: { title: string; description: string; color: string }) {
    return (
        <div className={`p-6 rounded-xl border-2 ${color} dark:bg-dark-800/50 transition-colors`}>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );  
}

