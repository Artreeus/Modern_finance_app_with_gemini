'use client';

import { useState } from 'react';
import { bdtToPaisa } from '@/lib/utils';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export function AddTransactionModal({ onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        type: 'expense' as 'income' | 'expense' | 'transfer',
        amount: '',
        category: '',
        note: '',
        occurredAt: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const amount = parseFloat(formData.amount);
            if (isNaN(amount) || amount <= 0) {
                setError('Please enter a valid amount');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: amount, // Store directly, no conversion
                    occurredAt: new Date(formData.occurredAt).toISOString(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to create transaction');
                return;
            }

            onSuccess();
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-dark-700 my-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Transaction</h2>
                    <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl font-bold transition-colors">
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Transaction Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white transition-colors"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                            <option value="transfer">Transfer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Amount (৳)
                        </label>
                        <input
                            type="number"
                            step="1"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            placeholder="1000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            placeholder="Food, Rent, Salary, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Note <span className="text-gray-500 dark:text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            rows={3}
                            placeholder="Add a note about this transaction..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.occurredAt}
                            onChange={(e) => setFormData({ ...formData, occurredAt: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition font-semibold border border-gray-300 dark:border-dark-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-500 dark:to-green-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-700 dark:hover:from-blue-600 dark:hover:to-green-600 transition disabled:opacity-50 font-semibold shadow-lg"
                        >
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

