'use client';

import React, { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { useAppSelector } from '@/lib/store/hooks';
import { Plus, Trash2, Hash, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceEditorFormProps {
    templateCustomization: {
        selectedTemplateId: string;
        setSelectedTemplateId: (id: string) => void;
        templates: Array<{
            id: string;
            name: string;
            category: string;
            description: string;
        }>;
    };
}

export function InvoiceEditorForm({ templateCustomization }: InvoiceEditorFormProps) {
    const { currentInvoice, setCustomer, updateMetadata, addItem, updateItem, removeItem, saveInvoice } = useInvoices();
    const { items: inventoryItems } = useAppSelector(state => state.inventory);
    const { selectedTemplateId, setSelectedTemplateId, templates } = templateCustomization;

    // Local state for product search
    const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    const handleAddProduct = (product: any) => {
        addItem({
            id: `ITEM-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.unitPrice,
            total: product.unitPrice
        });
        setIsProductSearchOpen(false);
        setSearchQuery('');
    };

    // Template thumbnail colors based on category (matching Zoho-style)
    const getTemplateStyle = (category: string) => {
        switch (category) {
            case 'modern':
                return 'bg-gradient-to-br from-slate-700 to-slate-900';
            case 'minimal':
                return 'bg-gradient-to-br from-slate-50 to-white border border-slate-200';
            case 'bold':
                return 'bg-gradient-to-br from-teal-500 to-teal-700';
            case 'professional':
                return 'bg-gradient-to-br from-blue-600 to-blue-800';
            case 'creative':
                return 'bg-gradient-to-br from-purple-600 to-indigo-800';
            default:
                return 'bg-slate-300';
        }
    };

    return (
        <div className="space-y-6 p-6 pb-6">

            {/* Template Selection - All 8 templates like Zoho */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Select Template</h3>
                <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => {
                        const isSelected = selectedTemplateId === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplateId(template.id)}
                                className={cn(
                                    "relative text-left rounded-xl border-2 transition-all group overflow-hidden",
                                    isSelected
                                        ? 'border-brand-teal ring-2 ring-brand-teal/20'
                                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                )}
                            >
                                {/* Template Preview Thumbnail */}
                                <div className={cn(
                                    "aspect-[1/1.2] relative overflow-hidden",
                                    getTemplateStyle(template.category)
                                )}>
                                    {/* Decorative invoice mockup */}
                                    <div className="absolute inset-3 flex flex-col">
                                        {/* Header */}
                                        <div className={cn(
                                            "flex justify-between items-start mb-2",
                                            template.category === 'minimal' ? "text-slate-400" : "text-white/40"
                                        )}>
                                            <div className="w-6 h-6 rounded bg-current opacity-40" />
                                            <div className="text-right">
                                                <div className="w-10 h-2 rounded bg-current opacity-30 mb-1" />
                                                <div className="w-6 h-1.5 rounded bg-current opacity-20" />
                                            </div>
                                        </div>

                                        {/* Content lines */}
                                        <div className="flex-1 flex flex-col gap-1 mt-2">
                                            <div className={cn(
                                                "w-3/4 h-1.5 rounded",
                                                template.category === 'minimal' ? "bg-slate-200" : "bg-white/20"
                                            )} />
                                            <div className={cn(
                                                "w-1/2 h-1 rounded",
                                                template.category === 'minimal' ? "bg-slate-100" : "bg-white/10"
                                            )} />
                                            <div className="mt-2 space-y-0.5">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className={cn(
                                                        "w-full h-1 rounded",
                                                        template.category === 'minimal' ? "bg-slate-100" : "bg-white/10"
                                                    )} />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className={cn(
                                            "mt-auto pt-2 border-t",
                                            template.category === 'minimal' ? "border-slate-200" : "border-white/20"
                                        )}>
                                            <div className={cn(
                                                "w-12 h-2 rounded ml-auto",
                                                template.category === 'minimal' ? "bg-slate-300" : "bg-white/30"
                                            )} />
                                        </div>
                                    </div>

                                    {/* Selection Overlay */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-brand-teal/30 backdrop-blur-[1px] flex items-center justify-center">
                                            <div className="bg-brand-teal text-white p-2 rounded-full shadow-lg">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Name & Description */}
                                <div className="p-2.5 bg-slate-50 dark:bg-white/5">
                                    <p className={cn(
                                        "text-[11px] font-bold truncate",
                                        isSelected ? 'text-brand-teal' : 'text-slate-700 dark:text-slate-300'
                                    )}>{template.name}</p>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{template.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Invoice Number</label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={currentInvoice.invoiceNumber}
                            onChange={(e) => updateMetadata({ invoiceNumber: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Date</label>
                        <input
                            type="date"
                            value={currentInvoice.date}
                            onChange={(e) => updateMetadata({ date: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Due Date</label>
                        <input
                            type="date"
                            value={currentInvoice.dueDate}
                            onChange={(e) => updateMetadata({ dueDate: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Bill To</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Customer Name</label>
                        <select
                            className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
                            value={currentInvoice.customerName}
                            onChange={(e) => setCustomer(e.target.value)}
                        >
                            <option value="">-- Select Customer --</option>
                            <option value="John Doe">John Doe</option>
                            <option value="Acme Corp">Acme Corp</option>
                            <option value="Jane Smith">Jane Smith</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                placeholder="customer@example.com"
                                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
                                value={currentInvoice.customerEmail || ''}
                                onChange={(e) => updateMetadata({ customerEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Billing Address</label>
                            <input
                                type="text"
                                placeholder="Street, City, Zip"
                                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
                                value={currentInvoice.customerAddress || ''}
                                onChange={(e) => updateMetadata({ customerAddress: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Line Items</h3>
                    <div className="relative">
                        {isProductSearchOpen ? (
                            <div className="absolute right-0 top-0 z-10 w-72 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
                                <input
                                    autoFocus
                                    placeholder="Search product..."
                                    className="w-full p-3 bg-transparent border-b border-slate-100 dark:border-slate-700 outline-none text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="max-h-48 overflow-y-auto">
                                    {filteredProducts.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleAddProduct(p)}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm"
                                        >
                                            <div className="font-medium">{p.name}</div>
                                            <div className="text-xs text-slate-500">₹{p.unitPrice}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsProductSearchOpen(true)}
                                className="flex items-center gap-2 text-sm font-bold text-brand-teal hover:text-teal-600"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {currentInvoice.items.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl text-slate-400 text-sm">
                            No items added yet.
                        </div>
                    )}
                    {currentInvoice.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                            <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900 dark:text-white">{item.productName}</p>
                                <p className="text-xs text-slate-500">₹{item.unitPrice}</p>
                            </div>
                            <div className="w-20">
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-1.5 text-center text-sm bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="w-24 text-right">
                                <p className="font-bold text-sm text-slate-900 dark:text-white">₹{item.total.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals & Notes */}
            <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Notes</label>
                    <textarea
                        className="w-full p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm min-h-[80px]"
                        placeholder="Add a note for the customer..."
                        value={currentInvoice.notes}
                        onChange={(e) => updateMetadata({ notes: e.target.value })}
                    />
                </div>

                <div className="border-t border-slate-100 dark:border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                        <span className="font-medium">₹{currentInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            Tax Rate (%)
                            <input
                                type="number"
                                className="w-14 p-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded text-center text-xs"
                                value={currentInvoice.taxRate}
                                onChange={(e) => updateMetadata({ taxRate: Number(e.target.value) })}
                            />
                        </span>
                        <span className="font-medium">₹{currentInvoice.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-white/10">
                        <span>Total</span>
                        <span className="text-brand-teal">₹{currentInvoice.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
