'use client';

import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

interface GridLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function GridLayout({ children, className = '' }: GridLayoutProps) {
    return (
        <div className={`
      grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-6
      auto-rows-[minmax(180px,auto)]
      ${className}
    `}>
            {children}
        </div>
    );
}

interface GridItemProps {
    id: string; // ID to match layout config
    children: React.ReactNode;
    className?: string;
}

export function GridItem({ id, children, className = '' }: GridItemProps) {
    const { getColSpan } = useDashboardLayout();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');

    // Determine span based on current breakpoint
    let span = 12;
    if (isMobile) span = getColSpan(id, 'mobile');
    else if (isTablet) span = getColSpan(id, 'tablet');
    else span = getColSpan(id, 'desktop');

    // Convert span number to Tailwind class
    // We need a complete safelist map because Tailwind doesn't support dynamic class construction like `col-span-${span}` unless safelisted.
    const spanClasses: Record<number, string> = {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
        5: 'col-span-5',
        6: 'col-span-6',
        7: 'col-span-7',
        8: 'col-span-8',
        9: 'col-span-9',
        10: 'col-span-10',
        11: 'col-span-11',
        12: 'col-span-12',
    };

    return (
        <div className={`${spanClasses[span] || 'col-span-12'} ${className}`}>
            {children}
        </div>
    );
}
