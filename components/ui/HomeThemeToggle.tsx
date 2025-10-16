'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function HomeThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white dark:bg-dark-800 shadow-lg border-2 border-gray-200 dark:border-dark-600 hover:scale-110 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-6 h-6 text-primary-400" />
                ) : (
                    <Sun className="w-6 h-6 text-primary-600" />
                )}
            </motion.div>
        </motion.button>
    );
}
