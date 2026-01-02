'use client';

import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { InventoryKpiCard } from '@/components/inventory/InventoryKpiCard';

export function InventoryStats() {
    // Define stats type for mapping
    const stats: Array<{
        title: string;
        value: string;
        trend: { value: string; direction: 'up' | 'down'; label: string };
        icon: any;
        color: 'lime' | 'red' | 'purple' | 'teal';
        cta: string;
    }> = [
            {
                title: 'Total Value',
                value: '$142,500',
                trend: { value: '5%', direction: 'up', label: 'vs last month' },
                icon: DollarSign,
                color: 'teal',
                cta: 'View Revenue Breakdown'
            },
            {
                title: 'Low Stock',
                value: '15',
                trend: { value: 'Critical', direction: 'down', label: 'below min' },
                icon: AlertTriangle,
                color: 'red',
                cta: 'View 15 Critical Items'
            },
            {
                title: 'Total SKUs',
                value: '1,248',
                trend: { value: '12', direction: 'up', label: 'new items' },
                icon: Package,
                color: 'purple',
                cta: 'View SKU Distribution'
            },
            {
                title: 'Avg Turnover',
                value: '4.2',
                trend: { value: 'Healthy', direction: 'up', label: 'rate' },
                icon: TrendingUp,
                color: 'lime', // Request asked for teal/purple/lime accents. Avg Turnover fits Lime.
                cta: 'View Turnover Trends'
            },
        ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <InventoryKpiCard
                    key={i}
                    title={stat.title}
                    value={stat.value}
                    trend={stat.trend}
                    icon={stat.icon}
                    color={stat.color}
                    detailStrip={stat.cta}
                    onClick={() => console.log('Clicked', stat.title)}
                />
            ))}
        </div>
    );
}
