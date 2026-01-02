'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <div className={cn("flex items-start justify-between", className)}>
            <div className="flex-1">
                <h1 className="text-page-title text-slate-900 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="ml-4">
                    {actions}
                </div>
            )}
        </div>
    );
}
