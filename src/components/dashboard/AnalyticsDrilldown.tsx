'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsDrilldownProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    error?: string | null;
    period?: string;
    onPeriodChange?: (period: string) => void;
}

export function AnalyticsDrilldown({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    isLoading,
    error,
    period,
    onPeriodChange
}: AnalyticsDrilldownProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                "relative w-full md:w-[680px] h-full bg-white dark:bg-dark-surface shadow-2xl border-l border-slate-200 dark:border-dark-border",
                "flex flex-col transform transition-transform duration-300 ease-out",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-dark-border flex items-start justify-between bg-slate-50/50 dark:bg-dark-surface/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}

                        {/* Period Toggle */}
                        {onPeriodChange && (
                            <div className="flex gap-2 mt-4 bg-slate-200/50 dark:bg-dark-base rounded-lg p-1 w-fit">
                                {['7D', '30D', '90D'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => onPeriodChange(p)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                            period === p
                                                ? "bg-white dark:bg-slate-700 text-brand-teal shadow-sm"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="animate-spin text-brand-teal" size={32} />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching analytics data...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center">
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
                                <AlertCircle className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Failed</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-brand-teal text-white font-bold rounded-xl"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}
