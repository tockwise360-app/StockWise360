'use client';

import React, { useState } from 'react';
import { Mail, Search, TrendingUp, Medal, Phone, Calendar, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_CUSTOMERS = [
    { id: 'CUST-001', name: 'ABC Company', email: 'contact@abc.com', spend: 125000, frequency: 23, lastOrder: '2025-12-20', credit: 5000, isHighValue: true },
    { id: 'CUST-002', name: 'Global Logics', email: 'info@global.io', spend: 84000, frequency: 15, lastOrder: '2025-12-18', credit: 0, isHighValue: true },
    { id: 'CUST-003', name: 'Nexus Corp', email: 'procurement@nexus.com', spend: 42000, frequency: 12, lastOrder: '2025-12-15', credit: 12000, isHighValue: false },
    { id: 'CUST-004', name: 'Silverline Ind.', email: 'accounts@silverline.in', spend: 18000, frequency: 5, lastOrder: '2025-12-10', credit: 2000, isHighValue: false },
    { id: 'CUST-005', name: 'Retail Hub', email: 'jack@retailhub.com', spend: 9500, frequency: 3, lastOrder: '2025-12-05', credit: 500, isHighValue: false },
];

export function CustomersDrilldown() {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'spend' | 'frequency' | 'recent'>('spend');

    const filtered = MOCK_CUSTOMERS
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'spend') return b.spend - a.spend;
            if (sortBy === 'frequency') return b.frequency - a.frequency;
            return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
        });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Total</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">342</p>
                    <p className="text-xs text-green-500 font-bold mt-1">+18 this month</p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 shadow-sm">
                    <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">High Value</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">42</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">&gt;₹50k Spend</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Spend</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹14.2k</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Per transaction</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-dark-base border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-teal outline-none"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-dark-base rounded-xl shrink-0">
                    {[
                        { id: 'spend', label: 'By Spend' },
                        { id: 'frequency', label: 'By Freq' },
                        { id: 'recent', label: 'Recent' }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSortBy(s.id as any)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                                sortBy === s.id ? "bg-white dark:bg-slate-700 text-brand-teal shadow-md" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer Cards/List */}
            <div className="space-y-4">
                {filtered.map((customer) => (
                    <div
                        key={customer.id}
                        className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-brand-teal group-hover:text-white transition-colors">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{customer.name}</h4>
                                        {customer.isHighValue && (
                                            <div className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                                                <Medal size={10} />
                                                High Value
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{customer.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`mailto:${customer.email}`}
                                    className="p-2.5 bg-slate-50 dark:bg-dark-base text-slate-400 hover:text-brand-teal hover:bg-teal-50 dark:hover:bg-teal-900/10 rounded-xl transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Mail size={18} />
                                </a>
                                <button className="p-2.5 bg-slate-50 dark:bg-dark-base text-slate-400 hover:text-brand-teal hover:bg-teal-50 dark:hover:bg-teal-900/10 rounded-xl transition-all">
                                    <Phone size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-dark-border">
                            <div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <TrendingUp size={12} />
                                    Total Spend
                                </div>
                                <p className="text-lg font-black text-slate-900 dark:text-white">₹{customer.spend.toLocaleString()}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <Calendar size={12} />
                                    Last Order
                                </div>
                                <p className="text-lg font-black text-slate-900 dark:text-white">
                                    {new Date(customer.lastOrder).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <CreditCard size={12} />
                                    Due Credit
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <p className={cn(
                                        "text-lg font-black",
                                        customer.credit > 10000 ? "text-red-500" : "text-green-500"
                                    )}>₹{customer.credit.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer View link */}
            <button className="w-full py-4 text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-brand-teal transition-all">
                View Export History & Segmentation Report
            </button>
        </div>
    );
}
