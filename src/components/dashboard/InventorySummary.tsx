'use client';

import React, { useState } from 'react';
import { Package, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StockValueDrilldown } from '@/components/dashboard/drilldowns/StockValueDrilldown';
import { LowStockDrilldown } from '@/components/dashboard/drilldowns/LowStockDrilldown';
import { CustomersDrilldown } from '@/components/dashboard/drilldowns/CustomersDrilldown';

type ActiveModal = 'value' | 'lowStock' | 'customers' | null;

export function InventorySummary() {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    return (
        <>
            <div className="grid grid-cols-1 gap-4 h-full">
                {/* Total SKUs - Clickable for Stock Value Drilldown */}
                <div
                    onClick={() => setActiveModal('value')}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col justify-between group hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] shadow-sm hover:shadow-lg"
                >
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-brand-teal/10 rounded-2xl border border-brand-teal/20 group-hover:bg-brand-teal/20 transition-colors">
                            <Package className="w-6 h-6 text-brand-teal" />
                        </div>
                        <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                            Total Stock
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">1,248</span>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full w-[70%] bg-brand-teal rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
                        </div>
                    </div>
                </div>

                {/* Low Stock - Clickable for Low Stock Drilldown */}
                <div
                    onClick={() => setActiveModal('lowStock')}
                    className="bg-red-500/5 backdrop-blur-xl border border-red-500/10 p-5 rounded-3xl flex flex-col justify-between group hover:bg-red-500/10 transition-all cursor-pointer hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-red-900/10"
                >
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                        </div>
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-red-200">15</span>
                        <p className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wide">Reorder Needed</p>
                    </div>
                </div>

                {/* Active Customers - Replaces Dead Stock */}
                <div
                    onClick={() => setActiveModal('customers')}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col justify-between group hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] shadow-sm hover:shadow-lg"
                >
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                            <Users className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                            Active Customers
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">342</span>
                        <div className="flex items-center gap-1 mt-1 text-xs font-bold text-green-400">
                            <span>+18%</span>
                            <span className="text-zinc-500 font-medium ml-1">vs last month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={activeModal === 'value'}
                onClose={() => setActiveModal(null)}
                title="Inventory Value Analysis"
            >
                <StockValueDrilldown />
            </Modal>

            <Modal
                isOpen={activeModal === 'lowStock'}
                onClose={() => setActiveModal(null)}
                title="Low Stock Alert & Reordering"
            >
                <LowStockDrilldown />
            </Modal>

            <Modal
                isOpen={activeModal === 'customers'}
                onClose={() => setActiveModal(null)}
                title="Customer Insights & Activity"
                className="max-w-4xl"
            >
                <CustomersDrilldown />
            </Modal>
        </>
    );
}
