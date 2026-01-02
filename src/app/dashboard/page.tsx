'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { Package, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { SalesRevenueChart } from '@/components/dashboard/SalesRevenueChart';
import { SalesByCategoryChart } from '@/components/dashboard/SalesByCategoryChart';
import { TopProductsTable } from '@/components/dashboard/TopProductsTable';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import { InventoryTurnoverChart } from '@/components/dashboard/InventoryTurnoverChart';
import { CashFlowForecast } from '@/components/dashboard/CashFlowForecast';

import { AnalyticsDrilldown } from '@/components/dashboard/AnalyticsDrilldown';
import { StockValueDrilldown } from '@/components/dashboard/drilldowns/StockValueDrilldown';
import { RevenueDrilldown } from '@/components/dashboard/drilldowns/RevenueDrilldown';
import { LowStockDrilldown } from '@/components/dashboard/drilldowns/LowStockDrilldown';
import { CustomersDrilldown } from '@/components/dashboard/drilldowns/CustomersDrilldown';
import { CategoryDetailDrilldown } from '@/components/dashboard/drilldowns/CategoryDetailDrilldown';

type DrilldownType = 'stock' | 'revenue' | 'low-stock' | 'customers' | 'category' | null;

export default function DashboardPage() {
    const [activeDrilldown, setActiveDrilldown] = React.useState<DrilldownType>(null);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [period, setPeriod] = React.useState('30D');

    return (
        <PageContainer>
            <PageHeader
                title="Dashboard"
                description="Real-time overview of your business performance"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Stock Value"
                    value="₹1,24,500"
                    description="Across 1,248 items"
                    icon={Package}
                    trend={{ value: 12.5, isPositive: true }}
                    onClick={() => setActiveDrilldown('stock')}
                />
                <KpiCard
                    title="Revenue (30D)"
                    value="₹42,500"
                    description="Last 30 days"
                    icon={DollarSign}
                    trend={{ value: 8.2, isPositive: true }}
                    onClick={() => setActiveDrilldown('revenue')}
                />
                <KpiCard
                    title="Low Stock Items"
                    value="15"
                    description="Need reordering"
                    icon={AlertTriangle}
                    onClick={() => setActiveDrilldown('low-stock')}
                />
                <KpiCard
                    title="Active Customers"
                    value="342"
                    description="This month"
                    icon={TrendingUp}
                    trend={{ value: 5.3, isPositive: true }}
                    onClick={() => setActiveDrilldown('customers')}
                />
            </div>

            {/* Analytics Modals */}
            <AnalyticsDrilldown
                isOpen={activeDrilldown === 'stock'}
                onClose={() => setActiveDrilldown(null)}
                title="Inventory Value Analysis"
                subtitle="Detailed breakdown of stock valuation and trends"
                period={period}
                onPeriodChange={setPeriod}
            >
                <StockValueDrilldown />
            </AnalyticsDrilldown>

            <AnalyticsDrilldown
                isOpen={activeDrilldown === 'revenue'}
                onClose={() => setActiveDrilldown(null)}
                title="Revenue Drill-Down"
                subtitle="Last 30 days invoice performance and payment status"
            >
                <RevenueDrilldown />
            </AnalyticsDrilldown>

            <AnalyticsDrilldown
                isOpen={activeDrilldown === 'low-stock'}
                onClose={() => setActiveDrilldown(null)}
                title="Low Stock Management"
                subtitle="Review and reorder items below safety threshold"
            >
                <LowStockDrilldown />
            </AnalyticsDrilldown>

            <AnalyticsDrilldown
                isOpen={activeDrilldown === 'customers'}
                onClose={() => setActiveDrilldown(null)}
                title="Customer Performance"
                subtitle="Top clients, spend patterns, and credit risk matrix"
            >
                <CustomersDrilldown />
            </AnalyticsDrilldown>

            <AnalyticsDrilldown
                isOpen={activeDrilldown === 'category'}
                onClose={() => {
                    setActiveDrilldown(null);
                    setSelectedCategory(null);
                }}
                title={`Category Analysis: ${selectedCategory}`}
                subtitle="Performance breakdown, top products, and AI recommendations"
            >
                {selectedCategory && <CategoryDetailDrilldown category={selectedCategory} />}
            </AnalyticsDrilldown>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-4">Revenue Trend</h3>
                    <SalesRevenueChart />
                </div>
                <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-4">Sales by Category</h3>
                    <SalesByCategoryChart onCategoryClick={(cat) => {
                        setSelectedCategory(cat);
                        setActiveDrilldown('category');
                    }} />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-4">Inventory Turnover</h3>
                    <InventoryTurnoverChart />
                </div>
                <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-4">Cash Flow Forecast</h3>
                    <CashFlowForecast />
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-4">Top Products</h3>
                    <TopProductsTable />
                </div>
                <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-4">Recent Transactions</h3>
                    <RecentTransactionsTable />
                </div>
            </div>
        </PageContainer>
    );
}
