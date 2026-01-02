'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';
import { Plus, Search, Filter, Download } from 'lucide-react';

export default function CustomersPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <PageContainer>
            <PageHeader
                title="Customers"
                description="Manage customer relationships and credit limits"
                actions={
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
                    >
                        <Plus size={18} strokeWidth={2} />
                        Add Customer
                    </button>
                }
            />

            {/* Filters & Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" size={16} strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm">
                        <Filter size={16} strokeWidth={2} /> Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm">
                        <Download size={16} strokeWidth={2} /> Export
                    </button>
                </div>
            </div>

            <CustomerTable />

            {/* Modal */}
            <AddCustomerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </PageContainer>
    );
}
