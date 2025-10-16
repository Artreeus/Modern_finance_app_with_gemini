'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, UserPlus, CheckCircle2 } from 'lucide-react';
import { HomeThemeToggle } from '@/components/ui/HomeThemeToggle';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        profession: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            // Redirect to sign in
            router.push('/auth/signin?registered=true');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Theme Toggle */}
            <HomeThemeToggle />
            
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl blur-lg opacity-25"></div>
                    
                    <div className="relative bg-white dark:bg-dark-800 p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-700 backdrop-blur-xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl mb-4 shadow-lg"
                            >
                                <UserPlus className="w-8 h-8 text-white" />
                            </motion.div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                                Join Finance App
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Start your financial journey today</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="Ahmed Hassan"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Profession Field */}
                            <div>
                                <label htmlFor="profession" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Profession <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">(optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Briefcase className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="profession"
                                        type="text"
                                        value={formData.profession}
                                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="Software Engineer"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Password <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">(min 8 characters)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full relative group bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-6"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Create Account
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        </form>

                        {/* Features List */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700/50 rounded-2xl border border-gray-200 dark:border-dark-600">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">What you get:</p>
                            <div className="space-y-2">
                                {[
                                    'AI-powered financial insights',
                                    'Unlimited transaction tracking',
                                    'Beautiful analytics dashboard',
                                    'Monthly PDF reports',
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 space-y-4">
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link href="/auth/signin" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold hover:underline">
                                    Sign In
                                </Link>
                            </p>

                            <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                                <Link 
                                    href="/" 
                                    className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back to home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

