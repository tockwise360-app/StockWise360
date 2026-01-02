'use client';

import React from 'react';
import { AlertTriangle, Clock, Star, TrendingUp } from 'lucide-react';
import { SmartSuggestion } from '@/lib/types/search';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SmartSuggestionsProps {
    suggestions: SmartSuggestion[];
    className?: string;
}

const ICON_MAP: Record<string, any> = {
    AlertTriangle,
    Clock,
    Star,
    TrendingUp
};

const PRIORITY_COLORS = {
    high: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
    medium: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
    low: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
};

export function SmartSuggestions({ suggestions, className }: SmartSuggestionsProps) {
    if (suggestions.length === 0) return null;

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
            {suggestions.slice(0, 3).map((suggestion) => {
                const Icon = ICON_MAP[suggestion.icon] || Star;
                const colorClass = PRIORITY_COLORS[suggestion.priority];

                return (
                    <Link
                        key={suggestion.id}
                        href={suggestion.url}
                        className={cn(
                            "group relative p-4 rounded-xl border transition-all duration-200",
                            "bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10",
                            "hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:scale-105",
                            "flex items-start gap-3"
                        )}
                    >
                        {/* Icon */}
                        <div className={cn("flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center", colorClass)}>
                            <Icon size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {suggestion.title}
                                </h3>
                                {suggestion.count !== undefined && (
                                    <span className={cn("flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold", colorClass)}>
                                        {suggestion.count}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {suggestion.description}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
