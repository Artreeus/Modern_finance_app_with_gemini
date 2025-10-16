'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    category: string;
    note: string;
    occurredAt: string;
}

interface EditTransactionModalProps {
    isOpen: boolean;
    transaction: Transaction | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditTransactionModal({ isOpen, transaction, onClose, onSuccess }: EditTransactionModalProps) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        note: '',
        occurredAt: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'];
    const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];
    const savingsCategories = ['Emergency Fund', 'Retirement', 'Investment', 'Goal Savings', 'Other'];

    useEffect(() => {
        if (transaction) {
            // Convert 'transfer' to 'savings' for display
            const displayType = transaction.type === 'transfer' ? 'savings' : transaction.type;
            
            setFormData({
                type: displayType,
                amount: transaction.amount.toString(),
                category: transaction.category,
                note: transaction.note,
                occurredAt: new Date(transaction.occurredAt).toISOString().split('T')[0],
            });
        }
    }, [transaction]);

    const getCategoriesByType = () => {
        switch (formData.type) {
            case 'income':
                return incomeCategories;
            case 'savings':
                return savingsCategories;
            default:
                return expenseCategories;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction) return;

        setLoading(true);
        setError('');

        try {
            // Convert savings to transfer for API compatibility
            const apiType = formData.type === 'savings' ? 'transfer' : formData.type;
            
            const response = await fetch(`/api/transactions/${transaction._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: apiType,
                    amount: parseFloat(formData.amount),
                    category: formData.category,
                    note: formData.note,
                    occurredAt: formData.occurredAt, // Send as string, API will convert
                }),
            });

            if (response.ok) {
                toast.success('Transaction updated successfully!');
                onSuccess();
                onClose();
            } else {
                const data = await response.json();
                const errorMsg = data.details 
                    ? `Validation error: ${data.details.map((d: any) => d.message).join(', ')}`
                    : data.error || 'Failed to update transaction';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = 'Network error. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !transaction || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-dark-700 my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Transaction</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => {
                                const newType = e.target.value;
                                // Get categories for new type
                                let newCategories;
                                switch (newType) {
                                    case 'income':
                                        newCategories = incomeCategories;
                                        break;
                                    case 'savings':
                                        newCategories = savingsCategories;
                                        break;
                                    default:
                                        newCategories = expenseCategories;
                                }
                                setFormData({ 
                                    ...formData, 
                                    type: newType,
                                    category: newCategories[0] || ''
                                });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                            <option value="savings">Savings</option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Amount ($) *
                        </label>
                        <input
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            {getCategoriesByType().map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.occurredAt}
                            onChange={(e) => setFormData({ ...formData, occurredAt: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Note
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            rows={3}
                            placeholder="Add a note..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
