'use client';

import { useState, useEffect } from 'react';

type LayoutItem = {
    id: string;
    colSpan: { desktop: number; tablet: number; mobile: number };
    order: number;
};

const DEFAULT_LAYOUT: LayoutItem[] = [
    { id: 'health-stats', colSpan: { desktop: 3, tablet: 3, mobile: 4 }, order: 1 },
    { id: 'revenue-chart', colSpan: { desktop: 5, tablet: 6, mobile: 4 }, order: 2 },
    { id: 'inventory-summary', colSpan: { desktop: 4, tablet: 3, mobile: 4 }, order: 3 },
    { id: 'top-products', colSpan: { desktop: 6, tablet: 6, mobile: 4 }, order: 4 },
    { id: 'sales-category', colSpan: { desktop: 6, tablet: 6, mobile: 4 }, order: 5 },
    { id: 'ai-insights', colSpan: { desktop: 4, tablet: 6, mobile: 4 }, order: 6 },
    { id: 'turnover', colSpan: { desktop: 4, tablet: 6, mobile: 4 }, order: 7 },
    { id: 'cash-flow', colSpan: { desktop: 4, tablet: 6, mobile: 4 }, order: 8 },
    { id: 'transactions', colSpan: { desktop: 12, tablet: 6, mobile: 4 }, order: 9 },
];

export function useDashboardLayout() {
    const [layout, setLayout] = useState<LayoutItem[]>([]);

    useEffect(() => {
        const savedLayout = localStorage.getItem('stockwise_dashboard_layout');
        if (savedLayout) {
            setLayout(JSON.parse(savedLayout));
        } else {
            setLayout(DEFAULT_LAYOUT);
        }
    }, []);

    const saveLayout = (newLayout: LayoutItem[]) => {
        setLayout(newLayout);
        localStorage.setItem('stockwise_dashboard_layout', JSON.stringify(newLayout));
    };

    const getColSpan = (id: string, breakpoint: 'desktop' | 'tablet' | 'mobile') => {
        const item = layout.find(l => l.id === id) || DEFAULT_LAYOUT.find(l => l.id === id);
        return item ? item.colSpan[breakpoint] : 12; // Default to full width if not found
    };

    return { layout, saveLayout, getColSpan };
}
