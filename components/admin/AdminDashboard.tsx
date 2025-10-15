'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { paisaToBdt } from '@/lib/utils';

interface Stats {
    totalUsers: number;
    activeUsersThisMonth: number;
    newUsersThisMonth: number;
    professionDistribution: { profession: string; count: number }[];
    topExpenseCategories: { category: string; total: number; count: number }[];
}

export function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading admin dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary-700">Admin Dashboard</h1>
                    <Link
                        href="/dashboard"
                        className="text-primary-600 hover:underline font-semibold"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {stats && (
                    <div className="space-y-6">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
                                <p className="text-3xl font-bold text-primary-700">{stats.totalUsers}</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Active This Month</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.activeUsersThisMonth}</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">New Users This Month</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.newUsersThisMonth}</p>
                            </div>
                        </div>

                        {/* Profession Distribution */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Profession Distribution
                            </h2>
                            {stats.professionDistribution.length > 0 ? (
                                <div className="space-y-2">
                                    {stats.professionDistribution.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b">
                                            <span className="text-gray-700">{item.profession}</span>
                                            <span className="font-semibold text-primary-600">{item.count} users</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No profession data available</p>
                            )}
                        </div>

                        {/* Top Expense Categories */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Top Expense Categories (All Time)
                            </h2>
                            {stats.topExpenseCategories.length > 0 ? (
                                <div className="space-y-2">
                                    {stats.topExpenseCategories.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b">
                                            <div>
                                                <span className="text-gray-700 font-medium">{item.category}</span>
                                                <span className="text-xs text-gray-500 ml-2">({item.count} transactions)</span>
                                            </div>
                                            <span className="font-semibold text-red-600">
                                                ৳{paisaToBdt(item.total).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No expense data available</p>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

