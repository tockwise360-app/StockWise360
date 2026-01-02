'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onFilterClick?: () => void;
    activeFiltersCount?: number;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    onFocus,
    onBlur,
    onFilterClick,
    activeFiltersCount = 0,
    className
}: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut: Cmd+K or Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }

            // Escape to clear or blur
            if (e.key === 'Escape') {
                if (value) {
                    onChange('');
                } else {
                    inputRef.current?.blur();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [value, onChange]);

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    const handleClear = () => {
        onChange('');
        inputRef.current?.focus();
    };

    return (
        <div className={cn("relative flex items-center gap-2", className)}>
            {/* Search Input Container */}
            <div
                className={cn(
                    "relative flex items-center w-full md:w-[400px] h-10 rounded-lg transition-all duration-200",
                    "bg-slate-100/50 dark:bg-white/5 border",
                    isFocused
                        ? "border-teal-500 dark:border-teal-500 ring-2 ring-teal-500/20"
                        : "border-slate-200 dark:border-white/10"
                )}
            >
                {/* Search Icon */}
                <div className="absolute left-3 pointer-events-none">
                    <Search size={16} className="text-slate-400 dark:text-slate-500" />
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search products, customers, invoices..."
                    className={cn(
                        "w-full h-full pl-10 pr-24 bg-transparent text-sm",
                        "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
                        "focus:outline-none"
                    )}
                />

                {/* Keyboard Shortcut Hint (when not focused and empty) */}
                {!isFocused && !value && (
                    <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                        <kbd className="hidden md:inline-flex h-5 px-1.5 items-center gap-1 rounded border border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                )}

                {/* Clear Button (when there's text) */}
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={14} className="text-slate-400 dark:text-slate-500" />
                    </button>
                )}
            </div>

            {/* Filters Button */}
            {onFilterClick && (
                <button
                    onClick={onFilterClick}
                    className={cn(
                        "relative flex items-center gap-2 px-3 h-10 rounded-lg transition-all duration-200",
                        "bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10",
                        "hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300",
                        "text-sm font-medium"
                    )}
                >
                    <SlidersHorizontal size={16} />
                    <span className="hidden md:inline">Filters</span>

                    {/* Active Filters Badge */}
                    {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 text-white text-xs font-bold">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
