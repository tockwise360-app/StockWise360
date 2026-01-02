import React from 'react';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { Package, Tag, FileText } from 'lucide-react';

interface Step1Props {
    formData: Partial<InventoryItem>;
    onChange: (data: Partial<InventoryItem>) => void;
}

export function Step1General({ formData, onChange }: Step1Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };

    const handleSkuGenerate = () => {
        const catPrefix = formData.category?.substring(0, 3).toUpperCase() || 'GEN';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        onChange({ sku: `${catPrefix}-${randomNum}` });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Package size={14} /> Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="e.g. Ergonomic Office Chair"
                        autoFocus
                    />
                </div>

                {/* SKU */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Tag size={14} /> SKU <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            name="sku"
                            value={formData.sku || ''}
                            onChange={handleChange}
                            className="flex-1 h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-mono font-bold uppercase text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="OFF-1234"
                        />
                        <button
                            onClick={handleSkuGenerate}
                            type="button"
                            className="px-4 h-12 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            Auto
                        </button>
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={14} /> Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category || ''}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all font-bold text-slate-900 dark:text-white appearance-none"
                    >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Home">Home</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="text-brand-teal font-bold">Tip:</span> SKU can be auto-generated based on the category.
            </p>
        </div>
    );
}
