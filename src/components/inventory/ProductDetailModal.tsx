import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { closeDetail } from '@/lib/store/features/inventorySlice';
import { Modal } from '@/components/ui/Modal';
import { ProductOverview } from './detail/ProductOverview';
import { StockAdjustmentForm } from './detail/StockAdjustmentForm';
import { StockHistory } from './detail/StockHistory';
import { cn } from '@/lib/utils';
import { Info, BarChart2, History } from 'lucide-react';

export function ProductDetailModal() {
    const dispatch = useAppDispatch();
    const { items, selectedItemId, isDetailOpen } = useAppSelector(state => state.inventory);
    const [activeTab, setActiveTab] = useState<'overview' | 'adjust' | 'history'>('overview');

    const item = items.find(i => i.id === selectedItemId);

    if (!item) return null;

    return (
        <Modal
            isOpen={isDetailOpen}
            onClose={() => dispatch(closeDetail())}
            title={item.name}
            className="max-w-4xl max-h-[85vh]"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full min-h-[500px]">
                {/* Left Column: Image & Quick Stats (Simulated Image) */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center relative overflow-hidden group">
                        <span className="text-6xl font-black text-slate-300 dark:text-white/20 select-none">
                            {item.sku.substring(0, 2)}
                        </span>
                        {/* Badge */}
                        {item.status !== 'In Stock' && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-black/50 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                {item.status}
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-500">SKU</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{item.sku}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-500">Category</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{item.category}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tabs & Content */}
                <div className="md:col-span-8 flex flex-col">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'overview'
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-brand-teal"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            <Info size={14} /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('adjust')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'adjust'
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-brand-teal"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            <BarChart2 size={14} /> Adjust Stock
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'history'
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-brand-teal"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            <History size={14} /> History
                        </button>
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 relative overflow-y-auto custom-scrollbar pr-2 -mr-2">
                        {activeTab === 'overview' && <ProductOverview item={item} />}
                        {activeTab === 'adjust' && <StockAdjustmentForm item={item} />}
                        {activeTab === 'history' && <StockHistory item={item} />}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
