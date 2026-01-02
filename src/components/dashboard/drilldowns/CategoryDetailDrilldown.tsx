'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, Info } from 'lucide-react';

const MOCK_CATEGORY_DATA = [
    { date: '2025-12-01', sales: 4500, items: 12 },
    { date: '2025-12-05', sales: 5200, items: 15 },
    { date: '2025-12-10', sales: 4800, items: 10 },
    { date: '2025-12-15', sales: 6100, items: 18 },
    { date: '2025-12-20', sales: 5800, items: 14 },
];

const TOP_PRODUCTS_BASE = [
    { name: 'Standard Item - S1', sales: 12500, stock: 15, growth: +12 },
    { name: 'Premium Pack - X2', sales: 9800, stock: 45, growth: +8 },
    { name: 'Basic Model - B1', sales: 7400, stock: 5, growth: -2 },
    { name: 'Accessory Kit', sales: 5200, stock: 82, growth: +15 },
];

export function CategoryDetailDrilldown({ category }: { category: string }) {
    // Basic dynamic data simulation
    const products = TOP_PRODUCTS_BASE.map(p => ({
        ...p,
        name: `${category} ${p.name.split('-')[0].trim()}`,
        sales: p.sales * (category.length / 5)
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category Share</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">32.5%</p>
                    <p className="text-xs text-brand-teal font-bold mt-1">Top Performing</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock Health</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Normal</p>
                    <p className="text-xs text-green-500 font-bold mt-1">85% In Stock</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Margin</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">24%</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Industry Std: 22%</p>
                </div>
            </div>

            {/* Performance Trend */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-teal" />
                    Revenue Trend: {category}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_CATEGORY_DATA}>
                            <defs>
                                <linearGradient id="catTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748B' }}
                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Sales']}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#catTrend)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products In Category */}
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={18} className="text-slate-400" />
                    Top Products In {category}
                </h3>
                <div className="space-y-3">
                    {products.map((prod) => (
                        <div key={prod.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-base border border-slate-200 dark:border-dark-border flex items-center justify-between group cursor-pointer hover:bg-white dark:hover:bg-dark-surface transition-all">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{prod.name}</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Stock: {prod.stock} units • ₹{(prod.sales / 1000).toFixed(1)}k Revenue</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded ${prod.growth > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                                    {prod.growth > 0 ? '+' : ''}{prod.growth}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-900/20 flex gap-3">
                <Info size={20} className="text-brand-teal shrink-0" />
                <p className="text-xs text-teal-700 dark:text-teal-400 leading-relaxed italic">
                    <span className="font-bold capitalize">{category}</span> is showing high velocity. Increase reorder point by 15% to avoid stockouts during peak season.
                </p>
            </div>
        </div>
    );
}
