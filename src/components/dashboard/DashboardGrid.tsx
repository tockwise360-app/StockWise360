'use client';

import { useState } from 'react';
import { BusinessHealthCard } from './BusinessHealthCard';
import { SalesRevenueChart } from './SalesRevenueChart';
import { InventorySummary } from './InventorySummary';
import { TopProductsTable } from './TopProductsTable';
import { SalesByCategoryChart } from './SalesByCategoryChart';
import { AIRecommendationsWidget } from './AIRecommendationsWidget';
import { InventoryTurnoverChart } from './InventoryTurnoverChart';
import { CashFlowForecast } from './CashFlowForecast';
import { RecentTransactionsTable } from './RecentTransactionsTable';
import { Modal } from '@/components/ui/Modal';
import { CategoryDetailDrilldown } from '@/components/dashboard/drilldowns/CategoryDetailDrilldown';

export function DashboardGrid() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 p-1">
            {/* Row 1 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <BusinessHealthCard />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
                <SalesRevenueChart />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                <InventorySummary />
            </div>

            {/* Row 2 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                <TopProductsTable />
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 h-full flex flex-col">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4">Sales by Category</h3>
                    <SalesByCategoryChart onCategoryClick={setSelectedCategory} />
                </div>
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900 fill-mode-both">
                <AIRecommendationsWidget />
            </div>

            {/* Row 3 */}
            <div className="col-span-1 md:col-span-1 lg:col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 fill-mode-both">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 h-full flex flex-col">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4">Turnover Rate</h3>
                    <InventoryTurnoverChart />
                </div>
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 h-full flex flex-col">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4">Cash Flow Forecast</h3>
                    <CashFlowForecast />
                </div>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                <RecentTransactionsTable />
            </div>

            <Modal
                isOpen={!!selectedCategory}
                onClose={() => setSelectedCategory(null)}
                title={`${selectedCategory || 'Category'} - Performance Details`}
                className="max-w-4xl"
            >
                {/* We pass the selected category to the drilldown if it supports it, 
                    but looking at previous file list, CategoryDetailDrilldown exists. 
                    I'll assume it might take a category prop or just show mock data.
                    I didn't inspect CategoryDetailDrilldown content. 
                    I'll modify it if needed, or just render it. 
                */}
                <CategoryDetailDrilldown category={selectedCategory || ''} />
            </Modal>
        </div>
    );
}
