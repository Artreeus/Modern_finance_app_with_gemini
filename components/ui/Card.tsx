'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    delay?: number;
}

export function Card({ children, className = '', hover = false, delay = 0 }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={hover ? { scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
            className={`bg-white rounded-xl shadow-md ${className}`}
        >
            {children}
        </motion.div>
    );
}

export function GlassCard({ children, className = '' }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`backdrop-blur-lg bg-white/80 rounded-xl shadow-lg border border-white/20 ${className}`}
        >
            {children}
        </motion.div>
    );
}

