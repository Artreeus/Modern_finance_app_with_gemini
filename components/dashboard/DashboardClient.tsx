'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TransactionList } from './TransactionList';
import { AddTransactionModal } from './AddTransactionModal';
import { MonthlySummary } from './MonthlySummary';
import { AIAdvice } from './AIAdvice';
import { Plus, LogOut, BarChart3, Settings, User, Target } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function DashboardClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const now = new Date();
        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        setCurrentMonth(monthStr);
    }, []);

    const handleLogout = async () => {
        const loadingToast = toast.loading('Logging out...');
        await signOut({ redirect: false });
        toast.dismiss(loadingToast);
        toast.success('Logged out successfully!', { duration: 2000 });
        setTimeout(() => {
            toast.dismiss();
            router.push('/');
        }, 1000);
    };

    const handleTransactionSuccess = () => {
        setShowAddModal(false);
        setRefreshKey(prev => prev + 1);
        toast.success('Transaction added successfully!');
    };

    return (
        <>
            <Toaster position="top-right" toastOptions={{
                className: 'dark:bg-dark-800 dark:text-white',
            }} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-colors">
                {/* Header */}
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-dark-700 transition-colors"
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-4"
                            >
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                                    Finova
                                </h1>
                            </motion.div>

                            <div className="flex items-center gap-3">
                                <ThemeToggle />

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-lg border border-primary-100 dark:border-primary-800"
                                >
                                    <User size={18} className="text-primary-600 dark:text-primary-400" />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{session?.user?.name}</span>
                                </motion.div>

                                <Link
                                    href="/dashboard/goals"
                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-all transform hover:scale-105 border border-green-100 dark:border-green-800"
                                >
                                    <Target size={18} />
                                    <span className="hidden md:inline font-medium">Goals</span>
                                </Link>

                                <Link
                                    href="/analytics"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all transform hover:scale-105 border border-blue-100 dark:border-blue-800"
                                >
                                    <BarChart3 size={18} />
                                    <span className="hidden md:inline font-medium">Analytics</span>
                                </Link>

                                {(session?.user as any)?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-4 py-2 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/50 transition-all transform hover:scale-105 border border-accent-100 dark:border-accent-800"
                                    >
                                        <Settings size={18} />
                                        <span className="hidden md:inline font-medium">Admin</span>
                                    </Link>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-100 dark:border-red-800"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden md:inline font-medium">Logout</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Left Column - Summary & AI */}
                        <div className="lg:col-span-1 space-y-6">
                            <MonthlySummary month={currentMonth} key={`summary-${refreshKey}`} />
                            <AIAdvice />
                        </div>

                        {/* Right Column - Transactions */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-100 dark:border-dark-700"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Transactions</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAddModal(true)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
                                    >
                                        <Plus size={20} />
                                        Add Transaction
                                    </motion.button>
                                </div>
                                <TransactionList month={currentMonth} key={`transactions-${refreshKey}`} />
                            </motion.div>
                        </div>
                    </motion.div>
                </main>

                {/* Add Transaction Modal */}
                {showAddModal && (
                    <AddTransactionModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={handleTransactionSuccess}
                    />
                )}
            </div>
        </>
    );
}

