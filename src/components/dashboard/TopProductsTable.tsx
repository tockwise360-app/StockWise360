'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    category: string;
    unitsSold: number;
    revenue: number;
    margin: number;
}

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Leather Wallet', category: 'Accessories', unitsSold: 124, revenue: 6200, margin: 45 },
    { id: '2', name: 'Wireless Headphones', category: 'Electronics', unitsSold: 85, revenue: 12750, margin: 30 },
    { id: '3', name: 'Ergonomic Chair', category: 'Furniture', unitsSold: 42, revenue: 8400, margin: 25 },
    { id: '4', name: 'Organic Green Tea', category: 'Groceries', unitsSold: 450, revenue: 4500, margin: 60 },
    { id: '5', name: 'Smartphone Stand', category: 'Accessories', unitsSold: 210, revenue: 3150, margin: 55 },
];

export function TopProductsTable() {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = [...MOCK_PRODUCTS].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Top Products</h3>
                <button className="text-xs font-bold text-brand-teal hover:underline flex items-center transition-colors">
                    Full Report <ArrowRight size={14} className="ml-1" />
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-dark-border text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <th className="py-3 pr-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center">Product <ArrowUpDown size={10} className="ml-1 opacity-50" /></div>
                            </th>
                            <th className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('unitsSold')}>
                                Units
                            </th>
                            <th className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('revenue')}>
                                Revenue
                            </th>
                            <th className="pl-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('margin')}>
                                Margin
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                        {sortedData.map((product) => (
                            <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-dark-base/50 transition-colors">
                                <td className="py-4 pr-4 text-xs">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white transition-colors">{product.name}</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">{product.category}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400">{product.unitsSold}</td>
                                <td className="px-4 py-4 text-right text-xs font-bold text-slate-900 dark:text-white">₹{product.revenue.toLocaleString()}</td>
                                <td className="pl-4 py-4 text-right">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                        product.margin > 40 ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' :
                                            product.margin > 20 ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-600' :
                                                'bg-red-50 dark:bg-red-900/10 text-red-600'
                                    )}>
                                        {product.margin}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
