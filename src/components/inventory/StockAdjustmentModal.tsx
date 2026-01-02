'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { closeAdjustmentModal } from '@/lib/store/features/inventorySlice';
import { useStockAdjustment } from '@/lib/hooks/useStockAdjustment';
import { GlassCard } from '@/components/ui/GlassCard';
import { X, Save, Plus, Minus, AlertTriangle, RefreshCw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Controller } from 'react-hook-form';

export function StockAdjustmentModal() {
    const dispatch = useAppDispatch();
    const { isAdjustmentModalOpen, selectedItemId, items } = useAppSelector((state) => state.inventory);

    const item = items.find(i => i.id === selectedItemId);
    const { form, isSubmitting, preview, onSubmit } = useStockAdjustment(item);

    // Close on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') dispatch(closeAdjustmentModal());
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);

    if (!isAdjustmentModalOpen || !item) return null;

    const { register, control, setValue, formState: { errors } } = form;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => dispatch(closeAdjustmentModal())}
            />

            <GlassCard className="relative w-full max-w-lg bg-white dark:bg-dark-surface border-slate-200 dark:border-white/5 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden rounded-[32px]">
                {/* Header */}
                <div className="p-8 pb-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl -mr-12 -mt-12" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Adjust Stock</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2 py-0.5 rounded">{item.sku}</span>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.name}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => dispatch(closeAdjustmentModal())}
                            className="p-2.5 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <form onSubmit={onSubmit} className="p-8 pt-6 space-y-8 overflow-y-auto custom-scrollbar">

                    {/* Current Stock Display */}
                    <div className="flex items-center justify-between bg-brand-teal/5 dark:bg-brand-teal/10 p-6 rounded-[24px] border border-brand-teal/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <RefreshCw size={80} className="text-brand-teal" />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] text-slate-500 dark:text-brand-teal font-black uppercase tracking-[0.2em]">Current Volume</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">{item.stockLevel}</span>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.unit}</span>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <span className={cn(
                                "text-[10px] font-black px-3 py-1 rounded-full inline-block border",
                                item.status === 'In Stock' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    item.status === 'Low Stock' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                        "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            )}>
                                {item.status.toUpperCase()}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Target: {item.maxStock}</p>
                        </div>
                    </div>

                    {/* Adjustment Type */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Adjustment Mode</label>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'add', label: 'ADD', icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
                                        { id: 'remove', label: 'REMOVE', icon: Minus, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
                                        { id: 'set', label: 'REPLACE', icon: RefreshCw, color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/30' },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => field.onChange(type.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-3 py-5 rounded-2xl border-2 transition-all duration-300 active:scale-95",
                                                field.value === type.id
                                                    ? `${type.bg} ${type.border} ${type.color} shadow-lg shadow-${type.id}-500/10`
                                                    : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                                            )}
                                        >
                                            <type.icon size={24} className={cn("transition-transform duration-300", field.value === type.id && "scale-110")} />
                                            <span className="text-[10px] font-black tracking-widest">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Transaction Quantity</label>
                        <div className="relative group">
                            <input
                                {...register('amount', { valueAsNumber: true })}
                                type="number"
                                className="w-full h-20 px-8 text-center bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand-teal/30 rounded-3xl text-3xl font-black text-slate-900 dark:text-white placeholder-slate-300 outline-none transition-all"
                                placeholder="0"
                            />
                            <div className="absolute inset-y-0 left-4 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setValue('amount', Math.max(0, (form.getValues('amount') || 0) - 1))}
                                    className="p-3 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/10 rounded-2xl transition-all"
                                >
                                    <Minus size={20} />
                                </button>
                            </div>
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setValue('amount', (form.getValues('amount') || 0) + 1)}
                                    className="p-3 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/10 rounded-2xl transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                        {errors.amount && (
                            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ml-2">
                                <AlertTriangle size={12} /> {errors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Reason */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Official Reason</label>
                        <div className="relative group">
                            <select
                                {...register('reason')}
                                className="w-full h-14 px-6 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-brand-teal/30 rounded-2xl text-sm font-bold text-slate-700 dark:text-white outline-none appearance-none transition-all"
                            >
                                <option value="">Select Category...</option>
                                <option value="restock">Purchasing / Restock</option>
                                <option value="sale">Fulfillment / Sale</option>
                                <option value="correction">Audit Correction</option>
                                <option value="damage">Damage / Expiry</option>
                                <option value="return">Return Log</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Summary Preview */}
                    <div className="p-6 bg-slate-900 rounded-[28px] border border-slate-700/50 shadow-inner group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impact Analysis</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-slate-400">Projected Variance</span>
                                <span className={cn(
                                    "text-lg font-black",
                                    preview.adjustmentValue > 0 ? "text-emerald-500" : preview.adjustmentValue < 0 ? "text-rose-500" : "text-white"
                                )}>
                                    {preview.adjustmentValue > 0 ? '+' : ''}{preview.adjustmentValue} Units
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline pt-4 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-400">New Inventory Level</span>
                                <span className="text-2xl font-black text-white">{preview.newStock} <span className="text-[10px] text-slate-500">{item.unit}</span></span>
                            </div>
                        </div>

                        {/* Warnings */}
                        {(preview.willBeNegative || preview.isLargeAdjustment) && (
                            <div className="mt-6 p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-rose-500">
                                    <AlertTriangle size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Security Alert</span>
                                </div>
                                <p className="text-[11px] font-medium text-rose-300 leading-relaxed">
                                    {preview.willBeNegative ? "This operation will result in a negative balance. Please verify stock manually." : "Large volume variance detected (>50%). Manager authorization may be required."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirmation */}
                    <div className="flex gap-4 pt-4 pb-4">
                        <button
                            type="button"
                            onClick={() => dispatch(closeAdjustmentModal())}
                            className="flex-1 py-5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "flex-[2] py-5 font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                                "bg-brand-teal hover:bg-teal-600 text-white shadow-brand-teal/20",
                                isSubmitting && "opacity-50 grayscale cursor-wait"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw size={20} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Finalize
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
