'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_FLOWS = [
    { date: '2025-12-01', type: 'Inflow', category: 'Sales', amount: 4500, description: 'Daily Sales' },
    { date: '2025-12-01', type: 'Outflow', category: 'Inventory', amount: 1200, description: 'Supplier Payment' },
    { date: '2025-12-02', type: 'Inflow', category: 'Collection', amount: 2800, description: 'Inv #442 Settlement' },
    { date: '2025-12-03', type: 'Outflow', category: 'Expenses', amount: 800, description: 'Utility Bill' },
    { date: '2025-12-04', type: 'Inflow', category: 'Sales', amount: 5100, description: 'Weekend Sale' },
    { date: '2025-12-05', type: 'Outflow', category: 'Payroll', amount: 6500, description: 'Staff Salaries' },
];

const DAILY_CHART_DATA = [
    { day: '01', inflow: 4500, outflow: 1200 },
    { day: '02', inflow: 2800, outflow: 500 },
    { day: '03', inflow: 3200, outflow: 800 },
    { day: '04', inflow: 5100, outflow: 1100 },
    { day: '05', inflow: 3900, outflow: 6500 },
    { day: '06', inflow: 4800, outflow: 900 },
    { day: '07', inflow: 5200, outflow: 1400 },
];

export function CashFlowDrilldown() {
    const [view, setView] = useState<'table' | 'chart'>('table');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/20">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                        <ArrowDownLeft size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Total Inflow (7D)</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹29,500</p>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <ArrowUpRight size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Total Outflow (7D)</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹12,400</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <TrendingUp size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Net Position</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">+₹17,100</p>
                </div>
            </div>

            {/* Toggle */}
            <div className="flex justify-end">
                <div className="bg-slate-100 dark:bg-dark-base rounded-lg p-1 flex gap-1">
                    <button
                        onClick={() => setView('table')}
                        className={cn("px-4 py-2 rounded-md text-xs font-bold transition-all", view === 'table' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}
                    >
                        Detailed List
                    </button>
                    <button
                        onClick={() => setView('chart')}
                        className={cn("px-4 py-2 rounded-md text-xs font-bold transition-all", view === 'chart' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}
                    >
                        Daily Chart
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === 'chart' ? (
                <div className="h-64 w-full bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DAILY_CHART_DATA}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} name="Inflow" />
                            <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} name="Outflow" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-dark-border">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-dark-base">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-dark-border bg-white dark:bg-dark-surface">
                            {MOCK_FLOWS.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-dark-base/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">{item.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{item.description}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">{item.category}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn(
                                            "text-sm font-black",
                                            item.type === 'Inflow' ? "text-emerald-500" : "text-red-500"
                                        )}>
                                            {item.type === 'Inflow' ? '+' : '-'}₹{item.amount}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
