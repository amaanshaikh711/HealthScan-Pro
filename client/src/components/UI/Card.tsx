import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CardProps extends HTMLMotionProps<"div"> {
    className?: string;
    children: React.ReactNode;
    noPadding?: boolean;
}

export const Card = ({ className, children, noPadding = false, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={twMerge(
                "bg-white/60 backdrop-blur-lg border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden",
                !noPadding && "p-6",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
