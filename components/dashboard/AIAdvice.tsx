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
            const res = await fetch('/api/advice', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                // Handle specific error cases
                if (res.status === 503) {
                    setError('AI feature is not configured. Please add your Gemini API key to .env file.');
                } else if (res.status === 404) {
                    setError('Add some transactions first to get personalized advice!');
                } else {
                    setError(data.error || 'Failed to generate advice. Please try again.');
                }
                return;
            }

            setAdvice(data.advice.response);
        } catch (err: any) {
            console.error('AI Advice error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-lg rounded-lg shadow-md p-6 border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Financial Advice</h2>
        <span className="text-xs bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 px-2 py-1 rounded-full font-medium">
          Optional
        </span>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-3 py-2 rounded-lg mb-4 text-sm">
          <p className="font-medium mb-1">⚠️ AI Feature Not Available</p>
          <p className="text-xs">{error}</p>
          {error.includes('not configured') && (
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs underline hover:text-yellow-900 dark:hover:text-yellow-300 mt-1 inline-block"
            >
              Get free API key →
            </a>
          )}
        </div>
      )}

      {advice ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{advice}</p>
          </div>
          <button
            onClick={generateAdvice}
            disabled={loading}
            className="w-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 py-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/60 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Generating...' : 'Generate New Advice'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={generateAdvice}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : '🤖 Get AI Advice'}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Get personalized financial advice based on your spending patterns
          </p>
        </div>
      )}
    </div>
  );
}

