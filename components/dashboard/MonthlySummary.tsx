'use client';

import { useState, useEffect } from 'react';
import { formatBDT } from '@/lib/utils';

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Summary</h2>
      
      {summary ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {formatBDT(summary.totalIncome)}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">
              {formatBDT(summary.totalExpense)}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${summary.netSavings >= 0 ? 'bg-primary-50' : 'bg-orange-50'}`}>
            <p className="text-sm text-gray-600">Net Savings</p>
            <p className={`text-2xl font-bold ${summary.netSavings >= 0 ? 'text-primary-700' : 'text-orange-600'}`}>
              {formatBDT(summary.netSavings)}
            </p>
          </div>

          <div className="mt-4">
            <a
              href={`/api/pdf/${month}`}
              download
              className="block w-full bg-gray-100 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-200 transition"
            >
              📄 Download PDF Report
            </a>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No data for this month yet.</p>
      )}
    </div>
  );
}

