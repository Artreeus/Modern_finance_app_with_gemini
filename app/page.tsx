'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HomeThemeToggle } from '@/components/ui/HomeThemeToggle';
import { 
    TrendingUp, Shield, Zap, BarChart3, ArrowRight, CheckCircle2, 
    Users, Star, Quote, FileText, CreditCard, Wallet, 
    PieChart, TrendingDown, Lock, Cloud, Smartphone, Download,
    ChevronDown, Sparkles, Target, Clock
} from 'lucide-react';

export default function Home() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (status === 'loading' || !mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-950 dark:to-dark-900 flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
                    </div>
                </div>
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
            title: 'Smart Tracking',
            description: 'Automatically categorize and track every transaction in BDT',
            color: 'from-green-400 to-green-600',
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Visual Analytics',
            description: 'Beautiful charts and insights to understand your spending',
            color: 'from-blue-400 to-blue-600',
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'AI Powered',
            description: 'Get personalized financial advice from Gemini AI',
            color: 'from-purple-400 to-purple-600',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Bank-Grade Security',
            description: 'Your data is encrypted and stored securely in the cloud',
            color: 'from-orange-400 to-orange-600',
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'PDF Reports',
            description: 'Download detailed monthly reports with one click',
            color: 'from-red-400 to-red-600',
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: 'Multi-Device',
            description: 'Access your finances from any device, anywhere',
            color: 'from-teal-400 to-teal-600',
        },
    ];

    const stats = [
        { value: '10K+', label: 'Active Users', icon: Users },
        { value: '৳50Cr+', label: 'Managed', icon: Wallet },
        { value: '99.9%', label: 'Uptime', icon: Shield },
        { value: '4.9/5', label: 'Rating', icon: Star },
    ];

    const testimonials = [
        {
            name: 'Ahmed Hassan',
            role: 'Software Engineer',
            avatar: '👨‍💻',
            content: 'This app transformed how I manage my finances. The AI advice is incredibly helpful!',
            rating: 5,
        },
        {
            name: 'Nadia Rahman',
            role: 'Business Owner',
            avatar: '👩‍💼',
            content: 'Perfect for tracking business expenses. The PDF reports save me hours every month.',
            rating: 5,
        },
        {
            name: 'Karim Ali',
            role: 'Student',
            avatar: '🎓',
            content: 'Simple and intuitive. Finally, I can track my spending without any hassle!',
            rating: 5,
        },
    ];

    const pricingPlans = [
        {
            name: 'Free',
            price: '৳0',
            period: 'forever',
            features: [
                'Up to 100 transactions/month',
                'Basic analytics',
                'Manual categorization',
                'Mobile & web access',
            ],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro',
            price: '৳299',
            period: '/month',
            features: [
                'Unlimited transactions',
                'AI-powered insights',
                'Auto categorization',
                'PDF reports',
                'Receipt storage',
                'Priority support',
            ],
            cta: 'Start Free Trial',
            popular: true,
        },
        {
            name: 'Business',
            price: '৳999',
            period: '/month',
            features: [
                'Everything in Pro',
                'Multi-user access',
                'Advanced analytics',
                'Custom categories',
                'API access',
                'Dedicated support',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ];

    const faqs = [
        {
            question: 'Is my financial data secure?',
            answer: 'Absolutely! We use bank-grade encryption, secure authentication with NextAuth, and store all data in encrypted MongoDB databases. Your privacy and security are our top priorities.',
        },
        {
            question: 'Can I export my data?',
            answer: 'Yes! You can download monthly PDF reports with all your transactions and analytics. We also provide data export options in CSV format.',
        },
        {
            question: 'How does the AI advice work?',
            answer: 'Our AI analyzes your spending patterns, income, and financial goals using Google Gemini AI. It provides personalized recommendations to help you save money and reach your financial goals.',
        },
        {
            question: 'Can I use this for business expenses?',
            answer: 'Yes! Our Pro and Business plans are perfect for tracking business expenses, generating reports for tax purposes, and managing company finances.',
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major payment methods including bKash, Nagad, Rocket, and credit/debit cards. All transactions are processed securely.',
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 overflow-hidden">
            {/* Theme Toggle Button */}
            <HomeThemeToggle />

            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 -z-10">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>

            {/* Hero Section */}
            <motion.section 
                style={{ opacity, scale }}
                className="relative container mx-auto px-4 pt-20 pb-32"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto"
                >
                    {/* Floating Badge */}
                    <motion.div 
                        variants={itemVariants} 
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                🇧🇩 Built for Bangladesh
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            <span className="inline-block">
                                <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 bg-clip-text text-transparent animate-gradient">
                                    Master Your
                                </span>
                            </span>
                            <br />
                            <span className="relative">
                                <span className="dark:text-white">Financial Future</span>
                                <motion.div
                                    className="absolute -bottom-4 left-0 right-0 h-3 bg-gradient-to-r from-primary-400 to-accent-400 opacity-30 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                />
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                            AI-powered finance management for Bangladesh. Track expenses, get insights, 
                            and achieve your financial goals—all in BDT 💰
                        </p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center flex-wrap mb-12"
                        >
                            <Link
                                href="/auth/register"
                                className="group relative px-10 py-5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <Link
                                href="/auth/signin"
                                className="px-10 py-5 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-400 transition-all transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 flex-wrap"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Free forever plan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Animated Dashboard Preview */}
                    <motion.div
                        variants={itemVariants}
                        className="relative max-w-6xl mx-auto"
                    >
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-dark-800 dark:to-dark-900 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 dark:border-dark-700">
                            <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 dark:bg-dark-700 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="pt-10 p-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-900 dark:to-dark-800 min-h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <motion.div
                                        animate={{ 
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <PieChart className="w-32 h-32 mx-auto text-primary-500 mb-4" />
                                    </motion.div>
                                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">Beautiful Analytics Dashboard</p>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">Track everything in real-time</p>
                                </div>
                            </div>
                        </div>
                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -right-4 top-20 bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-dark-700 hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">৳45,230</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className="absolute -left-4 bottom-20 bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-dark-700 hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">AI Insights</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Save 15% more</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-br from-primary-500 to-accent-500 dark:from-primary-700 dark:to-accent-700">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center text-white"
                            >
                                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-5xl font-bold mb-2"
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-lg opacity-90">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section className="py-32 container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Powerful features to take control of your finances
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="group bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-dark-700 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Get Started in 3 Easy Steps
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">Start managing your finances in minutes</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: '1', title: 'Create Account', description: 'Sign up with your email in seconds', icon: Users },
                                { step: '2', title: 'Add Transactions', description: 'Start tracking your income and expenses', icon: CreditCard },
                                { step: '3', title: 'Get Insights', description: 'Watch your AI-powered dashboard come to life', icon: Target },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative"
                                >
                                    <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-dark-700 text-center relative z-10">
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {item.step}
                                        </div>
                                        <item.icon className="w-16 h-16 mx-auto mt-4 mb-6 text-primary-500" />
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                    </div>
                                    {index < 2 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full z-0">
                                            <ArrowRight className="w-8 h-8 text-gray-300 dark:text-dark-600" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Loved by Thousands
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">See what our users have to say</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-dark-700"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="w-10 h-10 text-primary-300 dark:text-primary-700 mb-4" />
                                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-2xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-32 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-900 dark:to-dark-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits your needs</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {pricingPlans.map((plan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -5 }}
                                    className={`relative bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-xl border-2 ${
                                        plan.popular 
                                            ? 'border-primary-500 dark:border-primary-400' 
                                            : 'border-gray-200 dark:border-dark-700'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                            <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/auth/register"
                                        className={`block text-center py-4 rounded-xl font-bold transition-all ${
                                            plan.popular
                                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg'
                                                : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600'
                                        }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-32 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to know</p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="w-6 h-6 text-gray-500" />
                                    </motion.div>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: activeAccordion === index ? 'auto' : 0,
                                        opacity: activeAccordion === index ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 dark:from-primary-700 dark:via-primary-800 dark:to-accent-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center text-white"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Ready to Master Your Finances?
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 opacity-90">
                            Join thousands of users who are taking control of their financial future
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/auth/register"
                                className="group px-12 py-5 bg-white text-primary-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                Start Free Today
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <p className="mt-8 text-sm opacity-75">No credit card required • Free forever plan available</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-gray-900 dark:bg-dark-950 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                    Finance App
                                </h3>
                                <p className="text-gray-400 mb-4">Smart finance management for Bangladesh 🇧🇩</p>
                                <div className="flex gap-3">
                                    <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                                        <span className="text-xl">𝕏</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                                        <span className="text-xl">in</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                                        <span className="text-xl">f</span>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Product</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Resources</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Company</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                            <p>© 2025 Finance App. Built with ❤️ for Bangladesh. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

