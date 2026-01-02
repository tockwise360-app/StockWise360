'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/useCustomers';
import { PageContainer } from '@/components/layout/PageContainer';
import { CreditDashboard } from '@/components/customers/CreditDashboard';
import { ArrowLeft, Mail, Phone, Building2, MapPin, Edit, FilePlus } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { customers } = useCustomers();
    const [activeTab, setActiveTab] = useState<'overview' | 'credit' | 'invoices'>('overview');

    const customerId = params.id as string;
    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Not Found</h2>
                    <Link href="/customers" className="text-brand-teal hover:underline">Return to Customers</Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/customers"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Customers
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-brand-teal">
                            {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {customer.firstName} {customer.lastName}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {customer.company && (
                                    <>
                                        <Building2 size={14} />
                                        <span>{customer.company}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    </>
                                )}
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${customer.category === 'VIP'
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {customer.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-lg font-semibold transition-colors">
                            <Edit size={16} /> Edit
                        </button>
                        <button
                            onClick={() => router.push('/invoices/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-teal-500/20"
                        >
                            <FilePlus size={16} /> New Invoice
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200 dark:border-dark-border mb-8">
                {['overview', 'credit', 'invoices'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-sm font-semibold capitalize transition-colors relative ${activeTab === tab
                                ? 'text-brand-teal'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="card-gradient p-6 rounded-2xl border border-slate-200 dark:border-dark-border">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Email Address</p>
                                        <p className="text-slate-900 dark:text-white font-medium">{customer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Phone Number</p>
                                        <p className="text-slate-900 dark:text-white font-medium">{customer.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-xl">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Address</p>
                                        <p className="text-slate-900 dark:text-white font-medium">
                                            {customer.address.street}<br />
                                            {customer.address.city}, {customer.address.state} {customer.address.zip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 card-gradient p-6 rounded-2xl border border-slate-200 dark:border-dark-border">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                            <p className="text-slate-500 italic">No recent activity to display.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'credit' && (
                    <CreditDashboard customer={customer} />
                )}

                {activeTab === 'invoices' && (
                    <div className="text-center py-12 text-slate-500">
                        <FilePlus size={48} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Invoices Yet</h3>
                        <p>Create a new invoice to see it here.</p>
                    </div>
                )}
            </div>

        </PageContainer>
    );
}
