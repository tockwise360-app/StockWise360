'use client';

import React from 'react';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { ChevronRight, Package, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryMobileCardProps {
    item: InventoryItem;
    onClick: () => void;
}

export function InventoryMobileCard({ item, onClick }: InventoryMobileCardProps) {
    const margin = ((item.unitPrice - item.costPrice) / item.unitPrice) * 100;

    return (
        <div
            onClick={onClick}
            className="p-5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5 rounded-3xl active:scale-[0.98] transition-all group relative overflow-hidden"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-brand-teal/10 transition-colors" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2 py-0.5 rounded">
                            {item.sku}
                        </span>
                        <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                            item.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' :
                                item.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-red-500/10 text-red-500'
                        )}>
                            {item.status}
                        </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand-teal transition-colors line-clamp-1">
                        {item.name}
                    </h3>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-teal transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Package size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stock Level</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">{item.stockLevel}</span>
                        <span className="text-[10px] font-bold text-slate-500 transition-colors uppercase">{item.unit}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                        <div
                            className={cn(
                                "h-full rounded-full",
                                item.stockLevel <= item.minStock ? "bg-orange-500" : "bg-brand-teal"
                            )}
                            style={{ width: `${Math.min(100, (item.stockLevel / item.maxStock) * 100)}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <TrendingUp size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Margin</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-emerald-500">{Math.round(margin)}%</span>
                        <span className="text-[10px] font-bold text-slate-500 transition-colors uppercase">Gross</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        ₹{item.unitPrice.toLocaleString()} / unit
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 transition-colors uppercase tracking-widest">
                        {item.location[0]}
                    </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 transition-colors uppercase tracking-widest">
                    Updated {new Date(item.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
}
