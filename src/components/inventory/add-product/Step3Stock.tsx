import React, { useState } from 'react';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { Layers, AlertTriangle, ArrowUpCircle, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step3Props {
    formData: Partial<InventoryItem>;
    onChange: (data: Partial<InventoryItem>) => void;
}

export function Step3Stock({ formData, onChange }: Step3Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        onChange({ [e.target.name]: val });
    };

    const handleToggle = (key: keyof InventoryItem) => {
        onChange({ [key]: !formData[key] });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Initial Stock */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Layers size={14} /> Initial Stock Level <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="stockLevel"
                        value={formData.stockLevel || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 text-lg"
                        placeholder="0"
                    />
                </div>

                {/* Min Stock */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle size={14} className="text-orange-500" /> Min Stock (Alert)
                    </label>
                    <input
                        type="number"
                        name="minStock"
                        value={formData.minStock || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="10"
                    />
                </div>

                {/* Max Stock */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ArrowUpCircle size={14} className="text-brand-teal" /> Max Stock (Target)
                    </label>
                    <input
                        type="number"
                        name="maxStock"
                        value={formData.maxStock || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="100"
                    />
                </div>

                {/* Unit */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        Unit of Measure
                    </label>
                    <select
                        name="unit"
                        value={formData.unit || 'pcs'}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white"
                    >
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="l">Liter (l)</option>
                        <option value="m">Meter (m)</option>
                        <option value="box">Box</option>
                    </select>
                </div>
            </div>

            <div
                onClick={() => handleToggle('autoReorder')}
                className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                    formData.autoReorder
                        ? "bg-brand-teal/10 border-brand-teal/50"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300"
                )}
            >
                <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center transition-colors",
                    formData.autoReorder ? "bg-brand-teal text-white" : "bg-slate-200 text-transparent"
                )}>
                    <CheckSquare size={16} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enable Auto-Reorder</h4>
                    <p className="text-xs text-slate-500">Automatically flag for re-order when stock hits minimum level.</p>
                </div>
            </div>
        </div>
    );
}
