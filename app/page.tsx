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
    ChevronDown, Sparkles, Target, Clock, Rocket, Brain, LineChart,
    Bell, DollarSign, Globe, TrendingDown as TrendingDownIcon, Award, Repeat
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
            icon: <Brain className="w-8 h-8" />,
            title: 'AI Financial Advisor',
            description: 'Get personalized insights and recommendations from Gemini AI',
            color: 'from-accent-500 to-accent-600',
            iconBg: 'bg-accent-100 dark:bg-accent-900/20',
            iconColor: 'text-accent-600 dark:text-accent-400',
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Financial Goals',
            description: 'Set and track savings goals with AI-powered timeline predictions',
            color: 'from-success-500 to-success-600',
            iconBg: 'bg-success-100 dark:bg-success-900/20',
            iconColor: 'text-success-600 dark:text-success-400',
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: 'Smart Reminders',
            description: 'Never miss a bill with intelligent payment reminders',
            color: 'from-primary-500 to-primary-600',
            iconBg: 'bg-primary-100 dark:bg-primary-900/20',
            iconColor: 'text-primary-600 dark:text-primary-400',
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: 'Multi-Currency',
            description: 'Support for 150+ currencies with real-time exchange rates',
            color: 'from-primary-600 to-accent-600',
            iconBg: 'bg-primary-100 dark:bg-primary-900/20',
            iconColor: 'text-primary-600 dark:text-primary-400',
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Financial Health Score',
            description: 'Track your financial wellness with a personalized score',
            color: 'from-accent-500 to-pink-600',
            iconBg: 'bg-pink-100 dark:bg-pink-900/20',
            iconColor: 'text-pink-600 dark:text-pink-400',
        },
        {
            icon: <Repeat className="w-8 h-8" />,
            title: 'Budget Planner',
            description: 'Envelope budgeting system with overspending alerts',
            color: 'from-primary-500 to-primary-600',
            iconBg: 'bg-primary-100 dark:bg-primary-900/20',
            iconColor: 'text-primary-600 dark:text-primary-400',
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Expense Sharing',
            description: 'Split bills and track shared expenses with friends',
            color: 'from-success-500 to-success-600',
            iconBg: 'bg-success-100 dark:bg-success-900/20',
            iconColor: 'text-success-600 dark:text-success-400',
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Advanced Analytics',
            description: 'Interactive charts and deep insights into your spending',
            color: 'from-primary-500 to-accent-500',
            iconBg: 'bg-primary-100 dark:bg-primary-900/20',
            iconColor: 'text-primary-600 dark:text-primary-400',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Bank-Grade Security',
            description: 'Military-grade encryption and secure cloud storage',
            color: 'from-primary-600 to-primary-700',
            iconBg: 'bg-primary-100 dark:bg-primary-900/20',
            iconColor: 'text-primary-700 dark:text-primary-300',
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
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 -z-10">
                {/* Animated gradient orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="inline-block"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                            <span className="relative bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/20">
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    🌍 Global • AI-Powered • Smart
                                    <Rocket className="w-4 h-4" />
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
                                <span className="inline-block mb-2">
                                    <span className="relative">
                                        <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent">
                                            Finova
                                        </span>
                                        <motion.div
                                            className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 opacity-20 blur-2xl -z-10"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                    </span>
                                </span>
                                <br />
                                <span className="relative inline-block text-gray-900 dark:text-white">
                                    Your
                                    <motion.span
                                        className="ml-4 relative"
                                        animate={{ rotate: [0, 3, 0, -3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <span className="bg-gradient-to-r from-accent-600 via-pink-500 to-primary-600 bg-clip-text text-transparent">
                                            Financial
                                        </span>
                                    </motion.span>
                                    {' '}Genius
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p 
                            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Master your money with
                            <span className="text-primary-600 dark:text-primary-400 font-bold"> AI-powered insights</span>,
                            <span className="text-accent-600 dark:text-accent-400 font-bold"> smart budgeting</span>, and
                            <span className="text-success-600 dark:text-success-400 font-bold"> goal tracking</span>.
                            <br className="hidden md:block" />
                            <span className="inline-flex items-center gap-2 mt-2">
                                🌍 Multi-currency • 🇧🇩 Built for Bangladesh
                            </span>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-6 justify-center flex-wrap mb-12"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/auth/register"
                                    className="group relative px-12 py-5 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white rounded-2xl font-bold text-lg shadow-2xl overflow-hidden inline-flex items-center gap-3"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Rocket className="w-5 h-5" />
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 bg-white/20 blur-xl"></div>
                                    </div>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/auth/signin"
                                    className="group px-12 py-5 bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl border-2 border-primary-200 dark:border-primary-900 hover:border-primary-600 dark:hover:border-primary-400 transition-all inline-flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <Lock className="w-5 h-5" />
                                    Sign In
                                    <ArrowRight className="w-5 h-5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 flex-wrap"
                        >
                            <motion.div 
                                className="flex items-center gap-2 bg-white/60 dark:bg-dark-800/60 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-dark-700"
                                whileHover={{ scale: 1.05 }}
                            >
                                <CheckCircle2 className="w-5 h-5 text-success-500" />
                                <span className="font-medium">No credit card</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center gap-2 bg-white/60 dark:bg-dark-800/60 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-dark-700"
                                whileHover={{ scale: 1.05 }}
                            >
                                <CheckCircle2 className="w-5 h-5 text-success-500" />
                                <span className="font-medium">Free forever</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center gap-2 bg-white/60 dark:bg-dark-800/60 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-dark-700"
                                whileHover={{ scale: 1.05 }}
                            >
                                <CheckCircle2 className="w-5 h-5 text-success-500" />
                                <span className="font-medium">Cancel anytime</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Animated Dashboard Preview */}
                    <motion.div
                        variants={itemVariants}
                        className="relative max-w-6xl mx-auto mt-8"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl blur-2xl opacity-20"></div>
                        
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700 dark:border-dark-700">
                            {/* Browser chrome */}
                            <div className="bg-gray-800 dark:bg-dark-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700 dark:border-dark-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                                    <div className="w-3 h-3 rounded-full bg-success-500 hover:bg-success-400 transition-colors cursor-pointer"></div>
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="bg-gray-700 dark:bg-dark-700 rounded-lg px-4 py-1.5 text-xs text-gray-400 max-w-md">
                                        🔒 financeapp.com/dashboard
                                    </div>
                                </div>
                            </div>
                            
                            {/* Dashboard content */}
                            <div className="relative p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 min-h-[450px] overflow-hidden">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                </div>
                                
                                <div className="relative z-10 text-center">
                                    <motion.div
                                        animate={{ 
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{ 
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <div className="inline-block p-6 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl shadow-2xl mb-6">
                                            <LineChart className="w-32 h-32 text-white" strokeWidth={1.5} />
                                        </div>
                                    </motion.div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                                        Beautiful Analytics Dashboard
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Track everything in real-time with AI insights</p>
                                    
                                    {/* Stats preview */}
                                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                                        {[
                                            { label: 'Income', value: '৳45.2K', color: 'from-success-500 to-success-600' },
                                            { label: 'Expenses', value: '৳28.9K', color: 'from-primary-500 to-primary-600' },
                                            { label: 'Savings', value: '৳16.3K', color: 'from-accent-500 to-accent-600' },
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 1 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                                                className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-dark-700 shadow-lg"
                                            >
                                                <div className={`text-sm text-gray-600 dark:text-gray-400 mb-1`}>{stat.label}</div>
                                                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-6 top-24 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-5 border border-primary-200 dark:border-dark-700 hidden lg:block"
                            style={{ boxShadow: '0 20px 50px rgba(14, 165, 233, 0.2)' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">This Month</p>
                                    <p className="text-2xl font-black bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">৳45,230</p>
                                    <p className="text-xs text-success-600 dark:text-success-400 font-semibold">↑ 12% increase</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-6 bottom-32 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-5 border border-accent-200 dark:border-dark-700 hidden lg:block"
                            style={{ boxShadow: '0 20px 50px rgba(168, 85, 247, 0.2)' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg relative">
                                    <Brain className="w-7 h-7 text-white" strokeWidth={2.5} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Insight</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">Save 15% more</p>
                                    <p className="text-xs text-accent-600 dark:text-accent-400 font-semibold">Powered by Gemini</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ 
                                y: [0, -12, 0],
                                rotate: [0, 2, 0, -2, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 left-1/4 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-primary-200 dark:border-dark-700 hidden xl:block"
                            style={{ boxShadow: '0 20px 50px rgba(14, 165, 233, 0.15)' }}
                        >
                            <div className="flex items-center gap-3">
                                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" strokeWidth={2.5} />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Bank-Grade Security</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Your data is safe</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Stats Section */}
            <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 dark:from-primary-800 dark:via-primary-700 dark:to-accent-800 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>
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
                                    Finova
                                </h3>
                                <p className="text-gray-400 mb-4">Your AI-Powered Financial Genius 🌍</p>
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
                            <p>© 2025 Finova. Empowering financial freedom worldwide. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

