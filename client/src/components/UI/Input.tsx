import React, { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, icon, ...props }, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-sm font-semibold text-gray-700 ml-1">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        "w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm backdrop-blur-sm",
                        icon && "pl-10",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>}
        </div>
    );
});
Input.displayName = 'Input';
