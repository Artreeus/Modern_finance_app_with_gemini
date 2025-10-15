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
import { Plus, LogOut, BarChart3, Settings, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
        toast.loading('Logging out...');
        await signOut({ redirect: false });
        toast.success('Logged out successfully!');
        router.push('/');
    };

    const handleTransactionSuccess = () => {
        setShowAddModal(false);
        setRefreshKey(prev => prev + 1);
        toast.success('Transaction added successfully!');
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
                {/* Header */}
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-200"
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-4"
                            >
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                                    Finance App
                                </h1>
                            </motion.div>

                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-lg"
                                >
                                    <User size={18} className="text-primary-600" />
                                    <span className="text-gray-700 font-medium">{session?.user?.name}</span>
                                </motion.div>

                                <Link
                                    href="/analytics"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105"
                                >
                                    <BarChart3 size={18} />
                                    <span className="hidden md:inline font-medium">Analytics</span>
                                </Link>

                                {(session?.user as any)?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all transform hover:scale-105"
                                    >
                                        <Settings size={18} />
                                        <span className="hidden md:inline font-medium">Admin</span>
                                    </Link>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
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
                                className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAddModal(true)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
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

