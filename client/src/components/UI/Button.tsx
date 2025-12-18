
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps extends React.ComponentProps<typeof motion.button> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button = ({ className, variant = 'primary', size = 'md', isLoading, icon, children, ...props }: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/30 border-transparent",
        secondary: "bg-gradient-to-r from-secondary to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/30 border-transparent",
        accent: "bg-gradient-to-r from-accent to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/30 border-transparent",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg",
        icon: "p-2",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {icon && !isLoading && <span>{icon}</span>}
            {children as any}
        </motion.button>
    );
};
