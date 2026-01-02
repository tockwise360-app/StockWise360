import React from 'react';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { Package, Truck, AlertTriangle, CheckCircle, IndianRupee, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ProductOverviewProps {
    item: InventoryItem;
}

export function ProductOverview({ item }: ProductOverviewProps) {
    const percentage = Math.min((item.stockLevel / item.maxStock) * 100, 100);
    const isLowStock = item.stockLevel <= item.minStock;
    const isOverstock = item.stockLevel > item.maxStock;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Package size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Stock Level</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{item.stockLevel}</span>
                        <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-slate-400">
                        Min: {item.minStock} | Max: {item.maxStock}
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <IndianRupee size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Unit Price</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{item.unitPrice.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-slate-400">
                        Cost: ₹{item.costPrice.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Stock Visualizer */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Stock Capacity</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isLowStock ? 'bg-red-500' : isOverstock ? 'bg-orange-500' : 'bg-brand-teal'
                            }`}
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                    </div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>0</span>
                    <span>Target: {item.maxStock}</span>
                </div>
            </div>

            {/* Details List */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Truck size={14} /> Supplier
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.supplier}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Clock size={14} /> Lead Time
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.leadTime} Days</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        {isLowStock ? <AlertTriangle size={14} className="text-red-500" /> : <CheckCircle size={14} className="text-brand-teal" />} Status
                    </span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${isLowStock
                            ? 'bg-red-500/10 text-red-500'
                            : isOverstock
                                ? 'bg-orange-500/10 text-orange-500'
                                : 'bg-brand-teal/10 text-brand-teal'
                        }`}>
                        {item.status}
                    </span>
                </div>
            </div>

            <div className="pt-4 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Last Updated: {format(new Date(item.lastUpdated), 'PPP p')}
                </p>
            </div>
        </div>
    );
}
