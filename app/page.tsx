import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary-800 mb-6">
            Finance App (BDT)
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Manage your finances intelligently with AI-powered insights for Bangladesh
          </p>
          
          <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-primary-600 mb-2">
                  💰 Track Transactions
                </h3>
                <p className="text-gray-600">
                  Manage income, expenses, and transfers in BDT with ease
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-primary-600 mb-2">
                  📊 Monthly Reports
                </h3>
                <p className="text-gray-600">
                  Automated monthly summaries and PDF exports
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-primary-600 mb-2">
                  🤖 AI Financial Advice
                </h3>
                <p className="text-gray-600">
                  Get personalized advice powered by Gemini AI
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-primary-600 mb-2">
                  📸 Receipt Upload
                </h3>
                <p className="text-gray-600">
                  Store receipts securely with Cloudinary integration
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

