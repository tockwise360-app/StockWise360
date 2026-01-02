'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-none'
};

export function PageContainer({ children, className, maxWidth = 'full' }: PageContainerProps) {
    return (
        <div className={cn(
            "space-y-6",
            maxWidth !== 'full' && "mx-auto",
            maxWidthClasses[maxWidth],
            className
        )}>
            {children}
        </div>
    );
}
