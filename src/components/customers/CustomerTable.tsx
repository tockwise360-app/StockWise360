'use client';

import React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { MoreHorizontal, ArrowUpDown, Mail, Phone, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CustomerTable() {
    const router = useRouter();
    const { customers } = useCustomers();
    // Local state for sorting could be added here similar to InventoryList

    return (
        <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-card overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            <th className="px-6 py-4 cursor-pointer">Customer</th>
                            <th className="px-6 py-4 cursor-pointer">Contact Info</th>
                            <th className="px-6 py-4 cursor-pointer">Credit Status</th>
                            <th className="px-6 py-4 cursor-pointer text-center">Category</th>
                            <th className="px-6 py-4 cursor-pointer text-right">Balance</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-sm">
                        {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => router.push(`/customers/${customer.id}`)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm">
                                            {customer.firstName[0]}{customer.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{customer.firstName} {customer.lastName}</p>
                                            {customer.company && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Building2 size={10} />
                                                    {customer.company}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                                            <Mail size={12} /> {customer.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                                            <Phone size={12} /> {customer.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-full max-w-[140px]">
                                        <div className="flex justify-between text-[10px] mb-1 font-medium text-slate-500">
                                            <span>Used: ₹{customer.creditUsed}</span>
                                            <span>Limit: ₹{customer.creditLimit}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${(customer.creditUsed / customer.creditLimit) > 0.8
                                                        ? 'bg-red-500'
                                                        : (customer.creditUsed / customer.creditLimit) > 0.5
                                                            ? 'bg-amber-400'
                                                            : 'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${Math.min((customer.creditUsed / customer.creditLimit) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${customer.category === 'VIP'
                                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {customer.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                                    ₹{customer.creditUsed.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Open Context Menu
                                        }}
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls Placeholder */}
            <div className="p-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1 to {customers.length} of {customers.length} entries</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
}
