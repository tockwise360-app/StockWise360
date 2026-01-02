'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Package, CheckSquare } from 'lucide-react';
import { SearchResultType, SearchFilters } from '@/lib/types/search';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    filters: SearchFilters;
    onApplyFilters: (filters: SearchFilters) => void;
}

const CATEGORIES = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Office Supplies',
    'Hardware',
    'Other'
];

const STOCK_STATUS_OPTIONS = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
];

export function FilterPanel({ isOpen, onClose, filters, onApplyFilters }: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleTypeToggle = (type: SearchResultType) => {
        setLocalFilters(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    const handleCategoryChange = (category: string) => {
        if (category === 'All Categories') {
            setLocalFilters(prev => ({ ...prev, categories: [] }));
        } else {
            setLocalFilters(prev => ({
                ...prev,
                categories: prev.categories.includes(category)
                    ? prev.categories.filter(c => c !== category)
                    : [...prev.categories, category]
            }));
        }
    };

    const handleStockStatusToggle = (status: 'in-stock' | 'low-stock' | 'out-of-stock') => {
        setLocalFilters(prev => ({
            ...prev,
            stockStatus: prev.stockStatus?.includes(status)
                ? prev.stockStatus.filter(s => s !== status)
                : [...(prev.stockStatus || []), status]
        }));
    };

    const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
        setLocalFilters(prev => ({
            ...prev,
            priceRange: {
                min: field === 'min' ? value : prev.priceRange?.min || 0,
                max: field === 'max' ? value : prev.priceRange?.max || 10000
            }
        }));
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleClear = () => {
        const clearedFilters: SearchFilters = {
            types: ['product', 'customer', 'invoice'],
            categories: [],
        };
        setLocalFilters(clearedFilters);
        onApplyFilters(clearedFilters);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    "fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white dark:bg-[#0f172a] z-50",
                    "border-l border-slate-200 dark:border-white/10 shadow-2xl",
                    "animate-in slide-in-from-right duration-300"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={20} className="text-slate-400 dark:text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-140px)] p-6 space-y-6 custom-scrollbar">
                    {/* Type Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            <Package size={16} />
                            Result Type
                        </label>
                        <div className="space-y-2">
                            {(['product', 'customer', 'invoice'] as SearchResultType[]).map(type => (
                                <label key={type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.types.includes(type)}
                                        onChange={() => handleTypeToggle(type)}
                                        className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-teal-500 focus:ring-teal-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                                        {type}s
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            <CheckSquare size={16} />
                            Category
                        </label>
                        <div className="space-y-2">
                            {CATEGORIES.map(category => (
                                <label key={category} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={category === 'All Categories' ? localFilters.categories.length === 0 : localFilters.categories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                        className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-teal-500 focus:ring-teal-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            <DollarSign size={16} />
                            Price Range
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={localFilters.priceRange?.min || ''}
                                    onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <span className="text-slate-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={localFilters.priceRange?.max || ''}
                                    onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            <Package size={16} />
                            Stock Status
                        </label>
                        <div className="space-y-2">
                            {STOCK_STATUS_OPTIONS.map(option => (
                                <label key={option.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.stockStatus?.includes(option.value as any) || false}
                                        onChange={() => handleStockStatusToggle(option.value as any)}
                                        className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-teal-500 focus:ring-teal-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a] flex gap-3">
                    <button
                        onClick={handleClear}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}
