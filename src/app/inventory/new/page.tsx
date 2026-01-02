'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useInventory } from '@/hooks/useInventory';
import { useRouter } from 'next/navigation';
import { Save, X, Package, Tag, Layers, DollarSign, AlertCircle } from 'lucide-react';

export default function NewProductPage() {
    const router = useRouter();
    const { products } = useInventory();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        stock: '',
        minStock: '10',
        description: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Mock save delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        router.push('/inventory');
    };

    return (
        <PageContainer>
            <PageHeader
                title="Add New Product"
                description="Create a new item in your inventory"
            />

            <form onSubmit={handleSave} className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-6 md:col-span-2">
                        <div className="rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Package size={20} className="text-brand-teal" />
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Wireless Mouse"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SKU / Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. WM-001"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal transition-all appearance-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Textiles">Textiles</option>
                                        <option value="Hardware">Hardware</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unit Price (₹)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            required
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Info */}
                    <div className="rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 shadow-card">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-brand-teal" />
                            Inventory
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Initial Stock Level</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Low Stock Threshold</label>
                                <div className="relative">
                                    <AlertCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        required
                                        type="number"
                                        placeholder="10"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
                                        value={formData.minStock}
                                        onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="rounded-2xl bg-slate-900 dark:bg-brand-teal/10 border border-slate-800 dark:border-brand-teal/20 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Confirm Details</h3>
                            <p className="text-slate-400 text-sm">Review your product information before saving to the central database.</p>
                        </div>
                        <div className="space-y-3 mt-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-3 bg-brand-teal hover:bg-teal-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {isSaving ? 'Creating Product...' : 'Save Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </PageContainer>
    );
}
