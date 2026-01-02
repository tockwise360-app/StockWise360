'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingCart, AlertTriangle, Truck, Check, Package, TrendingUp, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_LOW_STOCK = [
    { id: 'PROD-001', name: 'Electronics Item 1 - Pro', sku: 'ELE-1000', current: 5, min: 20, recommended: 50, supplier: 'Supplier A', forecast: 35, leadTime: 3 },
    { id: 'PROD-002', name: 'Furniture Item 2 - Max', sku: 'FUR-1001', current: 2, min: 10, recommended: 25, supplier: 'Supplier B', forecast: 12, leadTime: 7 },
    { id: 'PROD-003', name: 'Home Item 3 - Lite', sku: 'HOM-1002', current: 8, min: 25, recommended: 40, supplier: 'Supplier A', forecast: 45, leadTime: 5 },
    { id: 'PROD-004', name: 'Groceries Item 4 - Standard', sku: 'GRO-1003', current: 12, min: 50, recommended: 100, supplier: 'Supplier C', forecast: 120, leadTime: 2 },
];

type SortOption = 'stock' | 'demand' | 'leadTime';

export function LowStockDrilldown() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isReordering, setIsReordering] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('stock');

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setSelectedIds(selectedIds.length === MOCK_LOW_STOCK.length ? [] : MOCK_LOW_STOCK.map(i => i.id));
    };

    const handleBulkReorder = () => {
        setIsReordering(true);
        // Simulate API call
        setTimeout(() => {
            setIsReordering(false);
            setShowSuccess(true);
            setSelectedIds([]);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const sortedItems = useMemo(() => {
        return [...MOCK_LOW_STOCK].sort((a, b) => {
            if (sortBy === 'stock') return a.current - b.current;
            if (sortBy === 'demand') return b.forecast - a.forecast;
            if (sortBy === 'leadTime') return b.leadTime - a.leadTime;
            return 0;
        });
    }, [sortBy]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Success Notification */}
            {showSuccess && (
                <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-between shadow-lg animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2">
                        <Check size={20} />
                        <span>Purchase Order(s) created successfully!</span>
                    </div>
                </div>
            )}

            {/* Header Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">15 Items</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Critical stock levels requiring attention</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/10 rounded-2xl w-fit">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>
            </div>

            {/* Sort & Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2">Sort By:</span>
                {[
                    { id: 'stock', label: 'Stock Level' },
                    { id: 'demand', label: 'Highest Demand' },
                    { id: 'leadTime', label: 'Longest Lead Time' },
                ].map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id as SortOption)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors",
                            sortBy === opt.id
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                : "bg-slate-100 dark:bg-dark-base text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-base/80"
                        )}
                    >
                        {opt.label}
                        {sortBy === opt.id && <ArrowUpDown size={12} />}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                            onClick={toggleAll}
                            className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                selectedIds.length === MOCK_LOW_STOCK.length ? "bg-brand-teal border-brand-teal" : "border-slate-300 dark:border-slate-600 group-hover:border-brand-teal"
                            )}
                        >
                            {selectedIds.length === MOCK_LOW_STOCK.length && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Select All Items</span>
                    </label>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedIds.length} Selected</p>
                </div>

                <div className="space-y-3">
                    {sortedItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center gap-4 group",
                                selectedIds.includes(item.id)
                                    ? "bg-teal-50/50 dark:bg-teal-900/5 border-teal-500/50"
                                    : "bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700"
                            )}
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <button
                                    onClick={() => toggleSelect(item.id)}
                                    className={cn(
                                        "shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all mt-1 sm:mt-0",
                                        selectedIds.includes(item.id)
                                            ? "bg-brand-teal border-brand-teal shadow-lg shadow-teal-500/30"
                                            : "border-slate-300 dark:border-slate-600"
                                    )}
                                >
                                    {selectedIds.includes(item.id) && <Check size={16} className="text-white" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.sku} • {item.supplier}</p>
                                        </div>
                                        <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                                            <p className="text-sm font-black text-red-500">{item.current} IN STOCK</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Min: {item.min}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                            <Truck size={14} className="text-slate-400" />
                                            Rec: <span className="text-brand-teal">{item.recommended}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                            <TrendingUp size={14} className="text-slate-400" />
                                            30D: {item.forecast}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                            <Package size={14} className="text-slate-400" />
                                            Lead: {item.leadTime}d
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Insight Section */}
            <div className="p-5 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <TrendingUp size={40} className="text-brand-teal" />
                </div>
                <div className="flex items-start gap-3 relative z-10">
                    <div className="p-2 bg-brand-teal text-white rounded-lg shadow-lg">
                        <TrendingUp size={16} />
                    </div>
                    <div>
                        <h5 className="text-xs font-black text-brand-teal uppercase tracking-widest mb-1 italic">AI Optimized Strategy</h5>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            Based on your {MOCK_LOW_STOCK.length} critical items, our AI suggests a <span className="text-brand-teal font-black">₹{MOCK_LOW_STOCK.reduce((acc, curr) => acc + curr.recommended * 50, 0).toLocaleString()}</span> reorder strategy to capture upcoming seasonal demand and reduce potential stockout losses by 22%.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <button
                disabled={selectedIds.length === 0 || isReordering}
                onClick={handleBulkReorder}
                className={cn(
                    "w-full py-4 font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl",
                    selectedIds.length === 0
                        ? "bg-slate-100 dark:bg-dark-base text-slate-400 cursor-not-allowed"
                        : "bg-brand-teal text-white hover:bg-teal-600 shadow-teal-500/20 active:scale-95"
                )}
            >
                {isReordering ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                    <>
                        <ShoppingCart size={20} />
                        CREATE PURCHASE ORDER ({selectedIds.length})
                    </>
                )}
            </button>
        </div>
    );
}
