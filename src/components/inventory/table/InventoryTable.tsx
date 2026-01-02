'use client';

import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { useInventoryTable } from '@/hooks/useInventoryTable';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChevronDown, ChevronUp, ChevronsUpDown, ArrowLeft, ArrowRight, Trash2, Edit, AppWindow, Layers, RefreshCw, Archive } from 'lucide-react';
import { InventorySearchBar } from '@/components/inventory/InventorySearchBar';
import { InventoryFilterBar } from '@/components/inventory/InventoryFilterBar';
import { InventoryRow } from '@/components/inventory/table/InventoryRow';
import { InventoryMobileCard } from '@/components/inventory/table/InventoryMobileCard';
import { useAppDispatch } from '@/lib/store/hooks';
import { useSearchParams } from 'next/navigation';
import {
    setCategoryFilter,
    setStatusFilter,
    setSupplierFilter,
    setPriceRangeFilter,
    setDateRangeFilter,
    setReorderOnly,
    resetFilters,
    selectItem,
    openAdjustmentModal,
    deleteItems
} from '@/lib/store/features/inventorySlice';

import { Modal } from '@/components/ui/Modal';

export function InventoryTable() {
    const { table, globalFilter, setGlobalFilter } = useInventoryTable();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    // Track active filter count for the indicator
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Sync URL parameters with Redux filters
    React.useEffect(() => {
        const filter = searchParams.get('filter');

        // Reset filters first to ensure a clean state
        dispatch(resetFilters());

        if (filter === 'low-stock') {
            dispatch(setStatusFilter(['Low Stock', 'Out of Stock']));
        } else if (filter === 'reorder') {
            dispatch(setReorderOnly(true));
        }
    }, [searchParams, dispatch]);

    const handleFilterChange = (filters: any) => {
        if (filters.status) dispatch(setStatusFilter(filters.status));
        if (filters.category) dispatch(setCategoryFilter(filters.category));
        if (filters.supplier) dispatch(setSupplierFilter(filters.supplier));
        if (filters.priceRange) dispatch(setPriceRangeFilter(filters.priceRange));
        if (filters.dateRange) dispatch(setDateRangeFilter(filters.dateRange));
        if (filters.reorderOnly !== undefined) dispatch(setReorderOnly(filters.reorderOnly));

        // Count active filters (simple count of non-empty arrays/values)
        let count = 0;
        if (filters.status?.length > 0) count++;
        if (filters.category?.length > 0) count++;
        if (filters.supplier?.length > 0) count++;
        if (filters.priceRange?.min > 0 || (filters.priceRange?.max < 10000 && filters.priceRange?.max > 0)) count++;
        if (filters.dateRange?.start || filters.dateRange?.end) count++;
        if (filters.reorderOnly) count++;
        setActiveFilterCount(count);
    };

    const confirmDelete = () => {
        const ids = Object.keys(table.getState().rowSelection);
        dispatch(deleteItems(ids));
        setIsDeleteModalOpen(false);
    };

    // Pagination Helpers
    const { pageSize, pageIndex } = table.getState().pagination;

    return (
        <GlassCard className="flex flex-col h-full overflow-hidden border-slate-200 dark:border-white/5 bg-white dark:bg-dark-surface">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md">
                <InventorySearchBar
                    value={globalFilter}
                    onChange={setGlobalFilter}
                    className="w-full md:w-96"
                />

                <InventoryFilterBar
                    onFilterChange={handleFilterChange}
                    activeFilters={activeFilterCount}
                />
            </div>

            {/* Table Area (Desktop) */}
            <div className="hidden md:block flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] select-none group cursor-pointer hover:text-brand-teal transition-colors"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <div className="w-4 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {{
                                                        asc: <ChevronUp size={12} className="text-brand-teal" />,
                                                        desc: <ChevronDown size={12} className="text-brand-teal" />,
                                                    }[header.column.getIsSorted() as string] ?? <ChevronsUpDown size={12} className="text-slate-300 dark:text-slate-600" />}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={table.getAllColumns().length} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-full">
                                            <Archive size={32} className="text-slate-300" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No items found matching your filters</p>
                                            <p className="text-xs text-slate-400">Try adjusting your search or filters to see results</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <InventoryRow
                                    key={row.id}
                                    row={row}
                                    onClick={() => row.toggleSelected()}
                                    onNameClick={() => dispatch(selectItem(row.original.id))}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex-1 overflow-auto custom-scrollbar p-4 space-y-4 bg-slate-50/50 dark:bg-dark-base/50">
                {table.getRowModel().rows.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-white dark:bg-white/5 rounded-full shadow-sm">
                                <Archive size={32} className="text-slate-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No items found</p>
                                <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    table.getRowModel().rows.map((row, idx) => (
                        <div
                            key={row.id}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                        >
                            <InventoryMobileCard
                                item={row.original}
                                onClick={() => dispatch(selectItem(row.original.id))}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Pagination & Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-dark-surface relative z-20">
                {/* Items Per Page */}
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:inline">
                        Rows per page
                    </span>
                    <select
                        className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>{pageSize}</option>
                        ))}
                    </select>

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {/* Fallback to simple page count if total unknown for now */}
                        Page <span className="text-slate-900 dark:text-white">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount()}
                    </span>
                </div>

                {/* Bulk Action Bar (Floating) */}
                {table.getSelectedRowModel().rows.length > 0 && (
                    <div className="absolute inset-x-0 bottom-full mb-6 px-4 flex justify-center pointer-events-none">
                        <div className="bg-slate-900 dark:bg-white border border-slate-700 dark:border-slate-200 shadow-2xl rounded-2xl p-2 flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
                            <span className="px-3 py-1 bg-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-teal/30">
                                {table.getSelectedRowModel().rows.length} Selected
                            </span>
                            <div className="h-4 w-px bg-slate-700 dark:bg-slate-200 mx-1" />
                            <div className="flex gap-1">
                                <button
                                    onClick={() => dispatch(openAdjustmentModal())} // Placeholder for Bulk Adjust
                                    className="p-2 hover:bg-slate-800 dark:hover:bg-slate-100 text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-900 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group"
                                >
                                    <RefreshCw size={14} className="group-hover:text-brand-teal" /> <span>Adjust Stock</span>
                                </button>
                                <button className="p-2 hover:bg-slate-800 dark:hover:bg-slate-100 text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-900 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <Layers size={14} /> <span>Category</span>
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 dark:hover:text-red-600 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                >
                                    <Trash2 size={14} /> <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-brand-teal hover:border-brand-teal/50 hover:bg-brand-teal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-brand-teal hover:border-brand-teal/50 hover:bg-brand-teal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-red-900 dark:text-red-200 mb-1">Irreversible Action</h3>
                            <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed">
                                You are about to delete <span className="font-black">{table.getSelectedRowModel().rows.length} items</span> from your inventory.
                                This action cannot be undone and will remove all associated stock history and data.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Delete Items
                        </button>
                    </div>
                </div>
            </Modal>
        </GlassCard>
    );
}
