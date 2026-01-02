'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock Data Generators
const generateTrendData = (period: '7d' | '30d' | '90d') => {
    const data = [];
    const count = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const baseValue = 110000;

    for (let i = 0; i < count; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (count - 1 - i));

        // Random fluctuation
        const randomChange = Math.floor(Math.random() * 5000) - 2000;
        // Gradual upward trend
        const trend = i * 150;

        data.push({
            date: date.toISOString().split('T')[0],
            value: baseValue + trend + randomChange
        });
    }
    return data;
};

const CATEGORY_BREAKDOWN = [
    { category: 'Electronics', value: 45000, items: 342, change: +5.2 },
    { category: 'Furniture', value: 32000, items: 156, change: -1.4 },
    { category: 'Home', value: 28500, items: 412, change: +8.7 },
    { category: 'Accessories', value: 19000, items: 338, change: +2.1 },
];

export function StockValueDrilldown() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(generateTrendData('30d'));

    useEffect(() => {
        setIsLoading(true);
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setData(generateTrendData(period));
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [period]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-base border border-slate-200 dark:border-dark-border">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Value</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹1,24,500</p>
                    <div className="flex items-center gap-1 text-green-500 text-xs font-bold mt-2">
                        <ArrowUpRight size={14} />
                        <span>+12.5% vs last month</span>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-base border border-slate-200 dark:border-dark-border">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active SKUs</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,248</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium"> Across 4 warehouses </p>
                </div>
                <div className="p-4 rounded-2xl bg-teal-500/10 dark:bg-teal-500/5 border border-teal-500/20">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider italic">AI Forecast</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹1.35L</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-2 font-medium"> Projected by End of Q4 </p>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-brand-teal" />
                        Value Trend Over Time
                    </h3>

                    {/* Period Toggle */}
                    <div className="flex p-1 bg-slate-100 dark:bg-dark-base rounded-xl self-start sm:self-auto">
                        {(['7d', '30d', '90d'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize",
                                    period === p
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {p.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-64 w-full relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="valueTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94A3B8' }}
                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                minTickGap={30}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '12px',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    color: '#0F172A'
                                }}
                                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#64748B' }}
                                formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Value']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#valueTrend)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown */}
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={18} className="text-slate-400" />
                    Value by Category
                </h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-dark-border divide-y divide-slate-200 dark:divide-dark-border">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-dark-base">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Value</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-surface">
                            {CATEGORY_BREAKDOWN.map((item) => (
                                <tr key={item.category} className="hover:bg-slate-50 dark:hover:bg-dark-base/50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">{item.category}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">₹{item.value.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.items}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-1 rounded-full",
                                            item.change > 0 ? "text-green-600 bg-green-50 dark:bg-green-900/10" : "text-red-600 bg-red-50 dark:bg-red-900/10"
                                        )}>
                                            {item.change > 0 ? '+' : ''}{item.change}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Link */}
            <Link
                href="/inventory"
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/10 dark:shadow-none flex items-center justify-center gap-2 group"
            >
                View Full Inventory Details
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
