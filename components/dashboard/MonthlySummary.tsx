'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatBDT } from '@/lib/utils';
import { TrendingUp, TrendingDown, Download, Wallet, CreditCard, PiggyBank } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface Summary {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    breakdown: Record<string, number>;
}

export function MonthlySummary({ month }: { month: string }) {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!month) return;

        const fetchSummary = async () => {
            try {
                const res = await fetch(`/api/summary/${month}`);
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data.summary);
                }
            } catch (error) {
                console.error('Failed to fetch summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [month]);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card hover className="p-6 bg-white/90 dark:bg-dark-800/90 backdrop-blur-lg border border-gray-100 dark:border-dark-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Monthly Summary</h2>
                <Wallet className="text-primary-500 dark:text-primary-400" size={24} />
            </div>

            {summary ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    {/* Income Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <TrendingUp className="text-white" size={20} />
                            </div>
                            <p className="text-sm font-medium text-green-700">Total Income</p>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            {formatBDT(summary.totalIncome)}
                        </p>
                    </motion.div>

                    {/* Expense Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-500 rounded-lg">
                                <CreditCard className="text-white" size={20} />
                            </div>
                            <p className="text-sm font-medium text-red-700">Total Expense</p>
                        </div>
                        <p className="text-3xl font-bold text-red-600">
                            {formatBDT(summary.totalExpense)}
                        </p>
                    </motion.div>

                    {/* Savings Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`bg-gradient-to-br p-4 rounded-xl border-2 ${summary.netSavings >= 0
                            ? 'from-primary-50 to-primary-100 border-primary-200'
                            : 'from-orange-50 to-orange-100 border-orange-200'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${summary.netSavings >= 0 ? 'bg-primary-500' : 'bg-orange-500'}`}>
                                <PiggyBank className="text-white" size={20} />
                            </div>
                            <p className={`text-sm font-medium ${summary.netSavings >= 0 ? 'text-primary-700' : 'text-orange-700'}`}>
                                Net Savings
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className={`text-3xl font-bold ${summary.netSavings >= 0 ? 'text-primary-600' : 'text-orange-600'}`}>
                                {formatBDT(summary.netSavings)}
                            </p>
                            {summary.netSavings >= 0 ? (
                                <TrendingUp className="text-primary-600" size={28} />
                            ) : (
                                <TrendingDown className="text-orange-600" size={28} />
                            )}
                        </div>
                    </motion.div>

                    {/* Download PDF Options */}
                    <div className="space-y-2">
                        <motion.a
                            href={`/api/pdf-simple/${month}`}
                            target="_blank"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                            <Download size={18} />
                            View & Print Report
                        </motion.a>
                        <p className="text-xs text-center text-gray-500">
                            Opens in new tab - Use browser's Print to save as PDF
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                >
                    <Wallet className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-500">No data for this month yet.</p>
                </motion.div>
            )}
        </Card>
    );
}

