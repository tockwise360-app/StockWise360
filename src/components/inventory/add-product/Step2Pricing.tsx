import React from 'react';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { DollarSign, Truck, Factory } from 'lucide-react';

interface Step2Props {
    formData: Partial<InventoryItem>;
    onChange: (data: Partial<InventoryItem>) => void;
}

export function Step2Pricing({ formData, onChange }: Step2Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        onChange({ [e.target.name]: val });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unit Price */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign size={14} /> Selling Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            name="unitPrice"
                            value={formData.unitPrice || ''}
                            onChange={handleChange}
                            className="w-full h-12 pl-8 pr-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Cost Price */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        Cost Price
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice || ''}
                            onChange={handleChange}
                            className="w-full h-12 pl-8 pr-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Supplier */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Factory size={14} /> Supplier
                    </label>
                    <input
                        name="supplier"
                        value={formData.supplier || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Supplier Name"
                    />
                </div>

                {/* Lead Time */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Truck size={14} /> Lead Time (Days)
                    </label>
                    <input
                        type="number"
                        name="leadTime"
                        value={formData.leadTime || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="e.g. 7"
                    />
                </div>
            </div>

            {formData.unitPrice && formData.costPrice && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/10 flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Expected Margin</span>
                    <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                        {Math.round(((formData.unitPrice - formData.costPrice) / formData.unitPrice) * 100)}%
                    </span>
                </div>
            )}
        </div>
    );
}
