import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventorySearchBarProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function InventorySearchBar({ value, onChange, className }: InventorySearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [localValue, setLocalValue] = useState(value);

    // Keyboard shortcut to focus search (/)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Sync with external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, onChange, value]);

    return (
        <div className={cn("relative group w-full max-w-md", className)}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-teal transition-colors duration-300" />
            </div>

            <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="Search products, SKUs, or categories..."
                className={cn(
                    "w-full h-12 pl-11 pr-12 text-sm bg-white dark:bg-dark-base border border-slate-200 dark:border-white/10 rounded-xl",
                    "text-slate-900 dark:text-slate-200 placeholder:text-slate-500",
                    "outline-none transition-all duration-300",
                    "focus:bg-white dark:focus:bg-[#0f172a]/60 focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 focus:shadow-lg focus:shadow-teal-900/10",
                    "hover:border-slate-300 dark:hover:border-white/20"
                )}
                suppressHydrationWarning
            />

            {/* Shortcut Hint */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 bg-slate-50 dark:bg-black/20">
                    /
                </span>
            </div>
        </div>
    );
}
