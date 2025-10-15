'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (status === 'loading' || !mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (session) {
        redirect('/dashboard');
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    const features = [
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Track Transactions',
            description: 'Manage income, expenses, and transfers in BDT with intelligent categorization',
            color: 'from-green-400 to-green-600',
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Advanced Analytics',
            description: 'Visualize spending patterns with interactive charts and insights',
            color: 'from-blue-400 to-blue-600',
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'AI Financial Advice',
            description: 'Get personalized recommendations powered by Gemini AI',
            color: 'from-purple-400 to-purple-600',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Secure & Private',
            description: 'Bank-level encryption with cloud backup and receipt storage',
            color: 'from-orange-400 to-orange-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className="inline-block mb-4"
                        >
                            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                                🇧🇩 Made for Bangladesh
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                            <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                                Smart Finance
                            </span>
                            <br />
                            Management
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Take control of your finances with AI-powered insights, beautiful analytics,
                            and automatic expense tracking—all in Bangladeshi Taka.
                        </p>

                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center flex-wrap"
                        >
                            <Link
                                href="/auth/register"
                                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                Get Started Free
                                <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link
                                href="/auth/signin"
                                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-primary-300 transition-all transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-primary-600 to-green-600 rounded-3xl p-12 text-white mb-16"
                    >
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl font-bold mb-8 text-center">Why Choose Finance App?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    'Automatic expense categorization',
                                    'Beautiful data visualizations',
                                    'AI-powered financial insights',
                                    'Secure cloud backup',
                                    'Monthly PDF reports',
                                    'Multi-device sync',
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                        <span className="text-lg">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center bg-white rounded-3xl p-12 shadow-xl"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Ready to Take Control?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Join thousands of users managing their finances smarter
                        </p>
                        <Link
                            href="/auth/register"
                            className="inline-block px-10 py-4 bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Start Your Journey →
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

