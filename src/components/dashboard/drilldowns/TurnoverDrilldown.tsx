'use client';

import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, ArrowDownRight, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_TURNOVER_ITEMS = [
    { id: 'PROD-005', name: 'Legacy Widget A', category: 'Toys', lastSold: '145 days ago', stock: 120, turnover: 0.8, status: 'Obsolete' },
    { id: 'PROD-008', name: 'Winter Jacket 2024', category: 'Fashion', lastSold: '85 days ago', stock: 45, turnover: 1.2, status: 'Slow' },
    { id: 'PROD-012', name: 'Old Model Phone', category: 'Electronics', lastSold: '60 days ago', stock: 12, turnover: 1.5, status: 'Slow' },
    { id: 'PROD-015', name: 'Canned Goods B', category: 'Grocery', lastSold: '2 days ago', stock: 500, turnover: 12.5, status: 'Fast' },
    { id: 'PROD-018', name: 'Smart Watch X', category: 'Electronics', lastSold: '1 day ago', stock: 85, turnover: 9.8, status: 'Fast' },
    { id: 'PROD-022', name: 'Ceramic Vase', category: 'Home', lastSold: '45 days ago', stock: 8, turnover: 2.1, status: 'Stable' },
];

export function TurnoverDrilldown() {
    const [filter, setFilter] = useState('slow'); // Default to showing slow moving
    const [search, setSearch] = useState('');

    const filtered = MOCK_TURNOVER_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'slow'
                ? ['Slow', 'Obsolete'].includes(item.status)
                : filter === 'fast'
                    ? item.status === 'Fast'
                    : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <AlertTriangle size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Slow Moving</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">145 Items</p>
                    <p className="text-xs text-slate-500 mt-1">Valued at ₹4.2L</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-base border border-slate-200 dark:border-dark-border">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                        <RefreshCw size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Avg Turnover</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">4.2x</p>
                    <p className="text-xs text-green-500 font-bold mt-1">+0.5 vs Industry</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/20">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                        <ArrowDownRight size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">High Velocity</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">85 Items</p>
                    <p className="text-xs text-slate-500 mt-1">Driving 60% Revenue</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-dark-base rounded-xl">
                    <button
                        onClick={() => setFilter('slow')}
                        className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2", filter === 'slow' ? "bg-white dark:bg-slate-700 text-red-500 shadow-sm" : "text-slate-500")}
                    >
                        <AlertTriangle size={12} /> Slow Moving
                    </button>
                    <button
                        onClick={() => setFilter('fast')}
                        className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2", filter === 'fast' ? "bg-white dark:bg-slate-700 text-emerald-500 shadow-sm" : "text-slate-500")}
                    >
                        <RefreshCw size={12} /> High Velocity
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", filter === 'all' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500")}
                    >
                        View All
                    </button>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-dark-base border-none rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-teal"
                    />
                </div>
            </div>

            {/* List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-dark-border">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-dark-base border-b border-slate-200 dark:border-dark-border">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Item Detail</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock Age</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Turnover Rate</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-surface divide-y divide-slate-100 dark:divide-dark-border">
                        {filtered.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-dark-base/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.id}</p>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">{item.category}</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        {item.lastSold}
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{item.stock} in stock</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.turnover}x</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                                        item.status === 'Obsolete' ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                            item.status === 'Slow' ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" :
                                                item.status === 'Stable' ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                                                    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    )}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">No items found matching filters.</div>
                )}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 flex items-start gap-3">
                <Filter className="text-blue-500 mt-1" size={16} />
                <div>
                    <h5 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Optimization Tip</h5>
                    <p className="text-xs text-blue-600 dark:text-blue-400/80 leading-relaxed">
                        You have 145 slow-moving items tying up capital. Consider creating a "Clearance Bundle" to free up warehouse space and recover costs.
                    </p>
                </div>
            </div>
        </div>
    );
}
