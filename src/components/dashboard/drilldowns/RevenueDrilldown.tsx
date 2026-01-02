'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FileDown, Search, ArrowUpRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_INVOICES = [
    { id: 'INV-001', customer: 'ABC Company', amount: 5900, date: '2025-12-20', status: 'paid' },
    { id: 'INV-002', customer: 'XYZ Retail', amount: 12400, date: '2025-12-19', status: 'pending' },
    { id: 'INV-003', customer: 'Global Logics', amount: 8200, date: '2025-12-18', status: 'overdue' },
    { id: 'INV-004', customer: 'Nexus Corp', amount: 4500, date: '2025-12-17', status: 'paid' },
    { id: 'INV-005', customer: 'Silverline Ind.', amount: 15600, date: '2025-12-15', status: 'paid' },
];

const BY_STATUS = [
    { name: 'Paid', value: 28000, color: '#10b981' },
    { name: 'Pending', value: 10000, color: '#f59e0b' },
    { name: 'Overdue', value: 4500, color: '#ef4444' },
];

export function RevenueDrilldown() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filteredInvoices = MOCK_INVOICES.filter(inv => {
        const matchesStatus = filter === 'all' || inv.status === filter;
        const matchesSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleExportCSV = () => {
        const headers = ['ID', 'Customer', 'Amount', 'Date', 'Status'];
        const rows = filteredInvoices.map(inv => [
            inv.id,
            inv.customer,
            inv.amount.toString(),
            inv.date,
            inv.status
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... Summary Grid ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Paid</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹28,000</p>
                    <p className="text-xs text-slate-500 mt-1">8 Invoices</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹10,000</p>
                    <p className="text-xs text-slate-500 mt-1">3 Invoices</p>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Overdue</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹4,500</p>
                    <p className="text-xs text-slate-500 mt-1">1 Invoice</p>
                </div>
            </div>

            {/* Visual Breakdown */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">Payment Distribution</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={BY_STATUS}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {BY_STATUS.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Revenue']}
                            />
                            <Legend verticalAlign="middle" align="right" layout="vertical" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List & Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-dark-base rounded-lg">
                        {['all', 'paid', 'pending', 'overdue'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-all",
                                    filter === s ? "bg-white dark:bg-slate-700 text-brand-teal shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-dark-base border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-teal"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-dark-border">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-dark-base">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-surface divide-y divide-slate-100 dark:divide-dark-border">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-dark-base/50 transition-colors cursor-pointer group">
                                    <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white">{inv.id}</td>
                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{inv.customer}</td>
                                    <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white">₹{inv.amount.toLocaleString()}</td>
                                    <td className="px-4 py-4">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                                            inv.status === 'paid' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10" :
                                                inv.status === 'pending' ? "text-amber-600 bg-amber-50 dark:bg-amber-900/10" :
                                                    "text-red-600 bg-red-50 dark:bg-red-900/10"
                                        )}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button className="p-2 text-slate-400 hover:text-brand-teal hover:bg-teal-50 dark:hover:bg-teal-900/10 rounded-lg transition-all">
                                            <FileDown size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={handleExportCSV}
                    className="flex-1 py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
                >
                    Export CSV
                </button>
                <button className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]">
                    View Full Billing
                </button>
            </div>
        </div>
    );
}
