'use client';

import { useState } from 'react';

export function AIAdvice() {
    const [advice, setAdvice] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateAdvice = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/advice', { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to generate advice');
                return;
            }

            const data = await res.json();
            setAdvice(data.advice.response);
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Financial Advice</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            {advice ? (
                <div className="space-y-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{advice}</p>
                    </div>
                    <button
                        onClick={generateAdvice}
                        disabled={loading}
                        className="w-full bg-primary-100 text-primary-700 py-2 rounded-lg hover:bg-primary-200 transition disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate New Advice'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={generateAdvice}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                    {loading ? 'Generating...' : '🤖 Get AI Advice'}
                </button>
            )}
        </div>
    );
}

