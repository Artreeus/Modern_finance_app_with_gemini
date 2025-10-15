'use client';

import { useState, useEffect } from 'react';
import { formatBDT } from '@/lib/utils';

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    category: string;
    note: string;
    occurredAt: string;
    receiptUrl?: string;
}

export function TransactionList({ month }: { month: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!month) return;

        const fetchTransactions = async () => {
            try {
                const res = await fetch(`/api/transactions?month=${month}&limit=50`);
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data.transactions);
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [month]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTransactions(transactions.filter((t) => t._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading transactions...</div>;
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No transactions for this month yet.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((txn) => (
                <div
                    key={txn._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${txn.type === 'income'
                                            ? 'bg-green-100 text-green-700'
                                            : txn.type === 'expense'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                >
                                    {txn.type}
                                </span>
                                <span className="text-sm text-gray-600">{txn.category}</span>
                            </div>
                            <p className="text-gray-800 font-medium">{txn.note || 'No note'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(txn.occurredAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-bold ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.type === 'income' ? '+' : '-'} {formatBDT(txn.amount)}
                            </p>
                            <button
                                onClick={() => handleDelete(txn._id)}
                                className="text-xs text-red-500 hover:text-red-700 mt-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

