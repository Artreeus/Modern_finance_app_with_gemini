'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface HealthScoreData {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Poor';
    breakdown: {
        savingsRate: { score: number; weight: number };
        budgetAdherence: { score: number; weight: number };
        goalsProgress: { score: number; weight: number };
        debtRatio: { score: number; weight: number };
        emergencyFund: { score: number; weight: number };
        consistency: { score: number; weight: number };
    };
    recommendations: string[];
}

export default function FinancialHealthScore() {
    const [healthData, setHealthData] = useState<HealthScoreData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHealthScore();
    }, []);

    const fetchHealthScore = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/health-score');
            
            if (!response.ok) {
                throw new Error('Failed to fetch health score');
            }

            const data = await response.json();
            setHealthData(data.healthScore);
        } catch (err) {
            setError('Unable to calculate health score');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 800) return 'from-success-500 to-success-600';
        if (score >= 650) return 'from-primary-500 to-primary-600';
        if (score >= 500) return 'from-yellow-500 to-orange-500';
        if (score >= 350) return 'from-orange-500 to-red-500';
        return 'from-red-600 to-red-700';
    };

    const getScoreEmoji = (score: number) => {
        if (score >= 800) return '🏆';
        if (score >= 650) return '🎯';
        if (score >= 500) return '📊';
        if (score >= 350) return '⚠️';
        return '🚨';
    };

    const getMetricIcon = (score: number) => {
        if (score >= 70) return <CheckCircle2 className="w-5 h-5 text-success-500" />;
        if (score >= 50) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        return <TrendingDown className="w-5 h-5 text-red-500" />;
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-dark-700">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-1/2"></div>
                    <div className="h-32 bg-gray-200 dark:bg-dark-700 rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !healthData) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-dark-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>{error || 'Unable to load health score'}</p>
                    <button
                        onClick={fetchHealthScore}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { score, rating, breakdown, recommendations } = healthData;
    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (score / 1000) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-dark-700"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="w-7 h-7 text-primary-600" />
                        Financial Health Score
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Your overall financial wellness</p>
                </div>
                <button
                    onClick={fetchHealthScore}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                >
                    Refresh
                </button>
            </div>

            {/* Score Circle */}
            <div className="flex items-center justify-center mb-8">
                <div className="relative">
                    <svg className="transform -rotate-90" width="200" height="200">
                        {/* Background circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-gray-200 dark:text-dark-700"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" className="text-primary-600" style={{ stopColor: 'currentColor' }} />
                                <stop offset="100%" className="text-accent-600" style={{ stopColor: 'currentColor' }} />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl mb-2">{getScoreEmoji(score)}</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white">{score}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">out of 1000</div>
                        <div className={`mt-2 px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor(score)} text-white text-sm font-bold`}>
                            {rating}
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Score Breakdown</h3>
                {Object.entries(breakdown).map(([key, data]) => {
                    const labels: Record<string, string> = {
                        savingsRate: 'Savings Rate',
                        budgetAdherence: 'Budget Adherence',
                        goalsProgress: 'Goals Progress',
                        debtRatio: 'Debt Management',
                        emergencyFund: 'Emergency Fund',
                        consistency: 'Consistency',
                    };

                    const percentage = Math.round(data.score);
                    const weightPercentage = Math.round(data.weight * 100);

                    return (
                        <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    {getMetricIcon(data.score)}
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {labels[key]}
                                    </span>
                                    <span className="text-gray-400 text-xs">({weightPercentage}%)</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">{percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={`h-full bg-gradient-to-r ${
                                        percentage >= 70
                                            ? 'from-success-500 to-success-600'
                                            : percentage >= 50
                                            ? 'from-yellow-500 to-orange-500'
                                            : 'from-red-500 to-red-600'
                                    }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 rounded-2xl p-6 border border-primary-200 dark:border-primary-900">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-600" />
                        Recommendations
                    </h3>
                    <ul className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                            >
                                <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                                    {index + 1}
                                </div>
                                <span>{rec}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
}
