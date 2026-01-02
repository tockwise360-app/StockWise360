import React, { useState } from 'react';
import { Filter, Check, RotateCcw, ChevronDown, Calendar, Tag, DollarSign, Truck, Activity, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setReorderOnly } from '@/lib/store/features/inventorySlice';

interface InventoryFilterBarProps {
    onFilterChange: (filters: any) => void;
    activeFilters: number;
}

export function InventoryFilterBar({ onFilterChange, activeFilters }: InventoryFilterBarProps) {
    const dispatch = useAppDispatch();
    const { reorderOnly, status, category, supplier, priceRange: reduxPrice, dateRange: reduxDate } = useAppSelector((state) => state.inventory.filters);
    const [isOpen, setIsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string[]>(status);
    const [categoryFilter, setCategoryFilter] = useState<string[]>(category);
    const [supplierFilter, setSupplierFilter] = useState<string[]>(supplier);
    const [priceRange, setPriceRange] = useState(reduxPrice);
    const [dateRange, setDateRange] = useState(reduxDate);

    // Sync with Redux state
    React.useEffect(() => {
        setStatusFilter(status);
        setCategoryFilter(category);
        setSupplierFilter(supplier);
        setPriceRange(reduxPrice);
        setDateRange(reduxDate);
    }, [status, category, supplier, reduxPrice, reduxDate]);

    const statuses = ['In Stock', 'Low Stock', 'Overstock', 'Out of Stock'];
    const categories = ['Electronics', 'Furniture', 'Home', 'Groceries', 'Accessories'];
    const suppliers = ['Global Tech', 'Furniture Mart', 'Eco Goods', 'Hardware Hub', 'Apex Supplies'];

    const toggleReorder = () => {
        dispatch(setReorderOnly(!reorderOnly));
        // We don't need to call updateFilters here because reorderOnly is in Redux 
        // and useInventoryTable reads it directly.
    };

    const toggleStatus = (status: string) => {
        const newStatuses = statusFilter.includes(status)
            ? statusFilter.filter(s => s !== status)
            : [...statusFilter, status];
        setStatusFilter(newStatuses);
        updateFilters({ status: newStatuses });
    };

    const toggleCategory = (category: string) => {
        const newCategories = categoryFilter.includes(category)
            ? categoryFilter.filter(c => c !== category)
            : [...categoryFilter, category];
        setCategoryFilter(newCategories);
        updateFilters({ category: newCategories });
    };

    const toggleSupplier = (supplier: string) => {
        const newSuppliers = supplierFilter.includes(supplier)
            ? supplierFilter.filter(s => s !== supplier)
            : [...supplierFilter, supplier];
        setSupplierFilter(newSuppliers);
        updateFilters({ supplier: newSuppliers });
    };

    const updateFilters = (changes: any) => {
        onFilterChange({
            status: statusFilter,
            category: categoryFilter,
            supplier: supplierFilter,
            priceRange,
            dateRange,
            ...changes
        });
    };

    const resetFilters = () => {
        setStatusFilter([]);
        setCategoryFilter([]);
        setSupplierFilter([]);
        setPriceRange({ min: 0, max: 10000 });
        setDateRange({ start: '', end: '' });
        onFilterChange({
            status: [],
            category: [],
            supplier: [],
            priceRange: { min: 0, max: 10000 },
            dateRange: { start: '', end: '' }
        });
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-12 px-6 flex items-center gap-2 rounded-xl border transition-all duration-200 group",
                    isOpen || activeFilters > 0
                        ? "bg-brand-teal/10 border-brand-teal/50 text-brand-teal"
                        : "bg-white dark:bg-[#0f172a]/40 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                )}
            >
                <Filter size={16} />
                <span className="font-semibold text-sm">Filters</span>
                {activeFilters > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-teal text-[10px] font-black text-white">
                        {activeFilters}
                    </span>
                )}
            </button>

            {/* Filter Popover */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-14 z-30 w-[320px] md:w-[480px] animate-in fade-in slide-in-from-top-2 duration-200">
                        <GlassCard className="p-6 border-slate-200 dark:border-slate-700/50 shadow-2xl bg-white dark:bg-dark-surface">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Advanced Filters</h3>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Refine your inventory view</p>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-brand-teal hover:underline flex items-center gap-1 font-bold"
                                >
                                    <RotateCcw size={12} /> Reset All
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Status Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <Activity size={14} className="text-brand-teal" /> Stock Status
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {statuses.map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => toggleStatus(status)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                        statusFilter.includes(status)
                                                            ? "bg-brand-teal/10 border-brand-teal/50 text-brand-teal shadow-inner"
                                                            : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                                                    )}
                                                >
                                                    {status}
                                                    {statusFilter.includes(status) && <Check size={12} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reorder Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <RefreshCw size={14} className="text-brand-teal" /> Procurement
                                        </div>
                                        <button
                                            onClick={toggleReorder}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                reorderOnly
                                                    ? "bg-brand-teal/10 border-brand-teal/50 text-brand-teal shadow-inner shadow-teal-500/10"
                                                    : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <RefreshCw size={14} className={cn(reorderOnly && "animate-spin-slow")} />
                                                Reorder Needed
                                            </div>
                                            {reorderOnly && <Check size={14} />}
                                        </button>
                                    </div>

                                    {/* Category Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <Tag size={14} className="text-brand-teal" /> Categories
                                        </div>
                                        <div className="grid grid-cols-1 gap-1 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => toggleCategory(cat)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                        categoryFilter.includes(cat)
                                                            ? "bg-brand-teal text-white shadow-lg"
                                                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                                                    )}
                                                >
                                                    {cat}
                                                    {categoryFilter.includes(cat) && <Check size={12} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Supplier Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <Truck size={14} className="text-brand-teal" /> Suppliers
                                        </div>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none appearance-none cursor-pointer"
                                                onChange={(e) => toggleSupplier(e.target.value)}
                                                value={supplierFilter[0] || ""}
                                            >
                                                <option value="">Select Supplier...</option>
                                                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {supplierFilter.map(s => (
                                                <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold flex items-center gap-1">
                                                    {s} <button onClick={() => toggleSupplier(s)}>✕</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={14} className="text-brand-teal" /> Price Range
                                            </div>
                                            <span className="text-brand-teal font-black">₹{priceRange.min} - ₹{priceRange.max}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            value={priceRange.max}
                                            onChange={(e) => {
                                                const max = parseInt(e.target.value);
                                                setPriceRange(prev => ({ ...prev, max }));
                                                updateFilters({ priceRange: { ...priceRange, max } });
                                            }}
                                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                                        />
                                    </div>

                                    {/* Date Picker */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <Calendar size={14} className="text-brand-teal" /> Last Updated
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-[10px] font-bold outline-none text-slate-600 dark:text-slate-400"
                                                onChange={(e) => {
                                                    const start = e.target.value;
                                                    setDateRange(prev => ({ ...prev, start }));
                                                    updateFilters({ dateRange: { ...dateRange, start } });
                                                }}
                                            />
                                            <input
                                                type="date"
                                                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-[10px] font-bold outline-none text-slate-600 dark:text-slate-400"
                                                onChange={(e) => {
                                                    const end = e.target.value;
                                                    setDateRange(prev => ({ ...prev, end }));
                                                    updateFilters({ dateRange: { ...dateRange, end } });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-8 py-3 bg-brand-teal hover:bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]"
                            >
                                Apply Filters
                            </button>
                        </GlassCard>
                    </div>
                </>
            )}
        </div>
    );
}
