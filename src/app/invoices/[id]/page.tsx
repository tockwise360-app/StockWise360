'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { PageContainer } from '@/components/layout/PageContainer';
import { ArrowLeft, Printer, Download, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { invoices } = useAppSelector((state) => state.invoice);

    // Find invoice by ID from URL params
    const invoiceId = params.id as string;
    const invoice = invoices.find((inv) => inv.id === invoiceId);

    if (!invoice && invoices.length > 0) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invoice Not Found</h2>
                    <p className="text-slate-500">The invoice you are looking for does not exist.</p>
                    <Link href="/invoices" className="text-brand-teal hover:underline">
                        Return to Invoices
                    </Link>
                </div>
            </PageContainer>
        );
    }

    // If mocking persistence and refresh clears state, show a helpful message or redirect (for now just returning not found logic implied above)

    if (!invoice) {
        // Fallback for empty state/refresh if data isn't persisted
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invoice Not Found</h2>
                    <p className="text-slate-500">No invoices found in session. (Mock Data Reset)</p>
                    <Link href="/invoices" className="text-brand-teal hover:underline">
                        Return to Invoices
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <PageContainer>
            {/* No-Print Header / Actions */}
            <div className="print:hidden mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/invoices"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Invoice #{invoice.id}
                            </h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${invoice.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                }`}>
                                {invoice.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">Created on {format(new Date(invoice.date), 'MMMM dd, yyyy')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg text-slate-700 dark:text-slate-200 font-medium transition-colors"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm">
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Invoice Document - This part gets printed */}
            <div className="bg-white dark:bg-dark-surface p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border max-w-4xl mx-auto print:shadow-none print:border-0 print:p-0 print:max-w-none">

                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-12 border-b border-slate-100 dark:border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-brand-teal">
                            {/* Logo Placeholder */}
                            <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">StockWise360</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                            <p>123 Business Street</p>
                            <p>Tech City, TC 90210</p>
                            <p>support@stockwise360.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-light text-slate-200 dark:text-slate-700 mb-2">INVOICE</h2>
                        <p className="font-medium text-slate-900 dark:text-white">#{invoice.id}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
                    </div>
                </div>

                {/* Bill To / Info */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Bill To</h3>
                        <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{invoice.customerName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Client Address Line 1<br />
                            City, Country
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-end gap-4">
                                <span className="text-slate-500">Status:</span>
                                <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                                    <CheckCircle size={14} /> {invoice.status}
                                </span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-slate-500">Due Date:</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {format(new Date(invoice.date), 'MMM dd, yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="py-3 font-semibold text-sm text-slate-500 dark:text-slate-400">Item Description</th>
                                <th className="py-3 font-semibold text-sm text-slate-500 dark:text-slate-400 text-center">Qty</th>
                                <th className="py-3 font-semibold text-sm text-slate-500 dark:text-slate-400 text-right">Price</th>
                                <th className="py-3 font-semibold text-sm text-slate-500 dark:text-slate-400 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {invoice.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-4">
                                        <p className="font-medium text-slate-900 dark:text-white">{item.productName}</p>
                                        <p className="text-xs text-slate-500">SKU: {item.productId.slice(0, 8)}...</p>
                                    </td>
                                    <td className="py-4 text-center text-slate-700 dark:text-slate-300">{item.quantity}</td>
                                    <td className="py-4 text-right text-slate-700 dark:text-slate-300">₹{item.unitPrice.toLocaleString()}</td>
                                    <td className="py-4 text-right font-medium text-slate-900 dark:text-white">₹{item.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span>₹{invoice.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Tax (10%)</span>
                            <span>₹{invoice.tax.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-white/10 my-4" />
                        <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white">
                            <span>Total</span>
                            <span className="text-brand-teal">₹{invoice.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/10 text-center text-sm text-slate-400">
                    <p>Thank you for your business!</p>
                </div>

            </div>
        </PageContainer>
    );
}
