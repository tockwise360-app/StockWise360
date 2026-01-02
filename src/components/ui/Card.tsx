'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "rounded-xl border transition-all duration-200",
                "bg-light-surface dark:bg-dark-surface",
                "border-light-border dark:border-dark-border",
                "shadow-sm hover:shadow-md",
                onClick && "cursor-pointer hover:scale-[1.02]",
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-6 pb-4", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3 className={cn("text-card-title text-slate-900 dark:text-white", className)}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <p className={cn("text-sm text-slate-600 dark:text-slate-400 mt-1", className)}>
            {children}
        </p>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-6 pt-0", className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 py-4 border-t border-light-border dark:border-dark-border", className)}>
            {children}
        </div>
    );
}
