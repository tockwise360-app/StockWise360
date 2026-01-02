'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    onClick?: () => void;
}

export function KpiCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    onClick
}: KpiCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 transition-all duration-200",
                "hover:shadow-card-hover hover:scale-[1.02]",
                onClick && "cursor-pointer",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {title}
                </span>
                {Icon && (
                    <Icon className="text-brand-teal transition-transform group-hover:scale-110" size={20} />
                )}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {value}
                </div>
                {trend && (
                    <span className={cn(
                        "text-sm font-medium flex items-center gap-1",
                        trend.isPositive ? "text-green-500" : "text-red-500"
                    )}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>

            {/* Description */}
            {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {description}
                </p>
            )}
        </div>
    );
}
