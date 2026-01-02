'use client';

import React from 'react';
import { Customer } from '@/lib/store/features/customerSlice';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CreditDashboardProps {
    customer: Customer;
}

export function CreditDashboard({ customer }: CreditDashboardProps) {
    const usagePercent = (customer.creditUsed / customer.creditLimit) * 100;
    const availableCredit = customer.creditLimit - customer.creditUsed;

    let statusColor = 'bg-emerald-500';
    let statusTextColor = 'text-emerald-600';
    if (usagePercent > 90) {
        statusColor = 'bg-red-500';
        statusTextColor = 'text-red-600';
    } else if (usagePercent > 75) {
        statusColor = 'bg-amber-400';
        statusTextColor = 'text-amber-600';
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Credit Summary Card */}
                <div className="md:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Credit Overview</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Current utilization</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${usagePercent > 90 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {usagePercent > 90 ? 'Limit Reached' : 'In Good Standing'}
                        </span>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm font-medium mb-2">
                            <span className="text-slate-600 dark:text-slate-300">Used: ₹{customer.creditUsed.toLocaleString()}</span>
                            <span className="text-slate-900 dark:text-white">Limit: ₹{customer.creditLimit.toLocaleString()}</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${statusColor}`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Available Credit</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{availableCredit.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Credit Terms</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{customer.creditTerms}</p>
                        </div>
                    </div>
                </div>

                {/* Actions / Stats */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Total Invoices</span>
                                <span className="font-semibold text-slate-900 dark:text-white">12</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Overdue Amount</span>
                                <span className="font-semibold text-red-600">₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Avg Payment Time</span>
                                <span className="font-semibold text-slate-900 dark:text-white">5 Days</span>
                            </div>
                        </div>
                        <button className="mt-6 w-full py-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
                            Request Limit Increase
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction History (Mock) */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-dark-border">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Credit History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-semibold border-b border-slate-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-center">Type</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {/* Mock Data */}
                            <tr>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{format(new Date(), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">Invoice #INV-2024-001 Creation</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">Usage</span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-red-600">-₹2,500</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{format(new Date(Date.now() - 86400000 * 5), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">Payment Received - Thank you</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">Payment</span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-emerald-600">+₹5,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
