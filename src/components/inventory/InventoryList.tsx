'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setSearch, setSort, selectItem, adjustStock } from '@/lib/store/features/inventorySlice';
import { Search, Filter, MoreHorizontal, ArrowUpDown, AlertCircle, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function InventoryList() {
    const dispatch = useAppDispatch();
    const { items, filters, sort } = useAppSelector((state) => state.inventory);

    // Local derived state for filtering/sorting
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.sku.toLowerCase().includes(filters.search.toLowerCase())
    ).sort((a, b) => {
        if (a[sort.key] < b[sort.key]) return sort.direction === 'asc' ? -1 : 1;
        if (a[sort.key] > b[sort.key]) return sort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: any) => {
        dispatch(setSort({
            key,
            direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="flex flex-col h-full rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-card">
            {/* Toolbar inside Card */}
            <div className="flex flex-col md:flex-row justify-between items-center p-6 pb-4 gap-4 border-b border-slate-200 dark:border-dark-border">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 group-focus-within:text-brand-teal transition-colors" size={16} strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Search by name, SKU..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
                        value={filters.search}
                        onChange={(e) => dispatch(setSearch(e.target.value))}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all">
                        <Filter size={16} strokeWidth={2} /> Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal hover:bg-teal-600 text-white rounded-xl text-xs font-semibold transition-all shadow-lg active:scale-95 duration-200">
                        <Plus size={16} strokeWidth={2} /> Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                            <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('name')}>Product / SKU</th>
                            <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('category')}>Category</th>
                            <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => handleSort('stockLevel')}>Stock</th>
                            <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => handleSort('status')}>Status</th>
                            <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => handleSort('unitPrice')}>Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-sm">
                        {filteredItems.map((item) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => dispatch(selectItem(item.id))}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{item.sku}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.category}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`font-bold ${item.stockLevel < item.minStock ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                            {item.stockLevel}
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-600">Min: {item.minStock}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${item.status === 'In Stock' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                                        item.status === 'Low Stock' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                                            item.status === 'Out of Stock' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                                                'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {item.status === 'Low Stock' && <AlertCircle size={10} />}
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-700 dark:text-slate-300">
                                    ${item.unitPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            onClick={() => dispatch(adjustStock({ id: item.id, amount: 1, type: 'add', reason: 'Quick Add', notes: 'Added from list view' }))}
                                        >
                                            <Plus size={14} strokeWidth={2} />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            onClick={() => dispatch(adjustStock({ id: item.id, amount: 1, type: 'remove', reason: 'Quick Remove', notes: 'Removed from list view' }))}
                                        >
                                            <Minus size={14} strokeWidth={2} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
