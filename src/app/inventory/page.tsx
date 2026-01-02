'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { InventoryKpiCard } from '@/components/inventory/InventoryKpiCard';
import { InventoryTable } from '@/components/inventory/table/InventoryTable';
import { ProductDetailModal } from '@/components/inventory/ProductDetailModal';
import { AddProductModal } from '@/components/inventory/AddProductModal';
import { DollarSign, AlertTriangle, Box, Activity, Plus } from 'lucide-react';

import { useAppDispatch } from '@/lib/store/hooks';
import { openAddProductModal } from '@/lib/store/features/inventorySlice';

export default function InventoryPage() {
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const trackKpiClick = (kpi: string) => {
        console.log(`[Analytics] KPI Click: ${kpi}`);
    };

    if (!mounted) {
        return null;
    }

    return (
        <PageContainer>
            <PageHeader
                title="Inventory Management"
                description="Real-time stock tracking and AI forecasting"
                actions={
                    <button
                        onClick={() => dispatch(openAddProductModal())}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-teal hover:bg-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95 duration-200"
                    >
                        <Plus size={18} strokeWidth={2} />
                        Add Product
                    </button>
                }
            />

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InventoryKpiCard
                    title="Total Value"
                    value="$142,500"
                    trend={{ value: "+5% vs last month", direction: "up", label: "vs last month" }}
                    icon={DollarSign}
                    color="lime"
                    detailStrip="View Revenue Breakdown"
                    onClick={() => trackKpiClick('totalValue')}
                />
                <InventoryKpiCard
                    title="Low Stock"
                    value="15"
                    trend={{ value: "Action needed", direction: "down", label: "items" }}
                    icon={AlertTriangle}
                    color="red"
                    detailStrip="View 15 Critical Items"
                    onClick={() => trackKpiClick('lowStock')}
                />
                <InventoryKpiCard
                    title="Total SKUs"
                    value="1,248"
                    trend={{ value: "+12 this week", direction: "up", label: "added" }}
                    icon={Box}
                    color="purple"
                    detailStrip="View All Products"
                    onClick={() => trackKpiClick('totalSkus')}
                />
                <InventoryKpiCard
                    title="Avg Turnover"
                    value="4.2"
                    trend={{ value: "Healthy rate", direction: "up", label: "" }}
                    icon={Activity}
                    color="teal"
                    detailStrip="View Turnover Trends"
                    onClick={() => trackKpiClick('avgTurnover')}
                />
            </div>

            <div className="flex-1 min-h-0">
                <InventoryTable />
            </div>

            <div className="flex-1 min-h-0">
                <InventoryTable />
            </div>

            <ProductDetailModal />
            <AddProductModal />
        </PageContainer>
    );
}
