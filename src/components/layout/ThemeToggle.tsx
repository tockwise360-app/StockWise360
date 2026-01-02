'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={cn("w-16 h-9 rounded-full bg-slate-200 dark:bg-slate-700 opacity-50", className)} />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative h-9 w-16 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
                theme === 'dark'
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-200 hover:bg-slate-300",
                className
            )}
            aria-label="Toggle Theme"
        >
            {/* Sliding Knob */}
            <div
                className={cn(
                    "absolute top-1 h-7 w-7 rounded-full bg-white shadow-lg transform transition-all duration-300 flex items-center justify-center",
                    theme === 'dark' ? "translate-x-7 bg-slate-800" : "translate-x-0 bg-white"
                )}
            >
                {theme === 'dark' ? (
                    <Moon size={14} className="text-teal-400" />
                ) : (
                    <Sun size={14} className="text-amber-500" />
                )}
            </div>

            {/* Track Icons (Background) */}
            <div className="flex justify-between items-center h-full px-2 relative z-0">
                <Sun
                    size={14}
                    className={cn(
                        "transition-opacity duration-300",
                        theme === 'light' ? "opacity-0" : "opacity-60 text-amber-400"
                    )}
                />
                <Moon
                    size={14}
                    className={cn(
                        "transition-opacity duration-300",
                        theme === 'dark' ? "opacity-0" : "opacity-60 text-slate-400"
                    )}
                />
            </div>
        </button>
    );
}
