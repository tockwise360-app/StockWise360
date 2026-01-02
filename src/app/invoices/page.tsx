'use client';

import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useInvoices } from '@/hooks/useInvoices';
import { Plus, FileText, Download, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function InvoicesPage() {
    const { invoices, isLoaded } = useInvoices();

    if (!isLoaded) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Invoices"
                description="Manage and generate bills for your customers"
                actions={
                    <Link
                        href="/invoices/new"
                        className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
                    >
                        <Plus size={18} strokeWidth={2} />
                        New Invoice
                    </Link>
                }
            />

            <div className="grid gap-4">
                {invoices.length === 0 ? (
                    <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-12 text-center shadow-card">
                        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                            <FileText size={48} className="mb-4 opacity-50" strokeWidth={2} />
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No Invoices Yet</h3>
                            <p className="mb-6">Create your first invoice to start tracking sales.</p>
                            <Link
                                href="/invoices/new"
                                className="px-4 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg font-medium text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                Create Invoice
                            </Link>
                        </div>
                    </div>
                ) : (
                    invoices.map((invoice) => (
                        <Link
                            key={invoice.id}
                            href={`/invoices/${invoice.id}`}
                            className="block rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-4 shadow-card hover:shadow-card-hover transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                                        <FileText size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{invoice.customerName}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            #{invoice.id} • {format(new Date(invoice.date), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">₹{invoice.total.toLocaleString()}</p>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${invoice.status === 'Paid'
                                                ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                                }`}
                                        >
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <div className="p-2 text-slate-400 group-hover:text-brand-teal transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </PageContainer>
    );
}
