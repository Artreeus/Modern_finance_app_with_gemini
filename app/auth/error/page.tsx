'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <div className="mb-6">
          <span className="text-6xl">⚠️</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Authentication Error
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error || 'An unexpected error occurred during authentication.'}
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Try Again
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

