'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'savings',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        priority: 'medium',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    targetAmount: parseFloat(formData.targetAmount),
                    currentAmount: parseFloat(formData.currentAmount || '0'),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess();
                onClose();
                setFormData({
                    name: '',
                    category: 'savings',
                    targetAmount: '',
                    currentAmount: '',
                    deadline: '',
                    priority: 'medium',
                    description: '',
                });
            } else {
                setError(data.error || 'Failed to create goal');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-dark-700 my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Goal</h2>
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
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Goal Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="e.g., Emergency Fund"
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
                            <option value="savings">Savings</option>
                            <option value="investment">Investment</option>
                            <option value="debt">Debt Payment</option>
                            <option value="emergency">Emergency Fund</option>
                            <option value="vacation">Vacation</option>
                            <option value="education">Education</option>
                            <option value="home">Home Purchase</option>
                            <option value="retirement">Retirement</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Amount Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Target Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Target Amount ($) *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                step="0.01"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="10000"
                            />
                        </div>

                        {/* Current Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Amount ($)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.currentAmount}
                                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Deadline and Priority Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Deadline *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            rows={3}
                            placeholder="Add any notes or details about this goal..."
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
                            {loading ? 'Creating...' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
