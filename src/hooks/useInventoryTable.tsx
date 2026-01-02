'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    ColumnDef,
    SortingState,
    VisibilityState,
    PaginationState,
    Updater,
} from '@tanstack/react-table';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
    selectItem,
    setSearch,
    setPagination,
    setRowSelection,
} from '@/lib/store/features/inventorySlice';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { deleteItems } from '@/lib/store/features/inventorySlice';

// Helper Component for Indeterminate Checkbox
function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate, rest.checked])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}

// Define Table Hook
export function useInventoryTable() {
    const dispatch = useAppDispatch();
    const { items, filters, pagination, rowSelection } = useAppSelector((state) => state.inventory);

    // Table State
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // Filtered data based on Redux filter state
    const filteredData = useMemo(() => {
        return items.filter(item => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    item.name.toLowerCase().includes(searchLower) ||
                    item.sku.toLowerCase().includes(searchLower) ||
                    item.category.toLowerCase().includes(searchLower) ||
                    item.supplier.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(item.status)) {
                return false;
            }

            // Category filter
            if (filters.category.length > 0 && !filters.category.includes(item.category)) {
                return false;
            }

            // Supplier filter
            if (filters.supplier.length > 0 && !filters.supplier.includes(item.supplier)) {
                return false;
            }

            // Price range filter
            if (item.unitPrice < filters.priceRange.min || item.unitPrice > filters.priceRange.max) {
                return false;
            }

            // Date range filter
            if (filters.dateRange.start || filters.dateRange.end) {
                const updatedDate = new Date(item.lastUpdated);
                if (filters.dateRange.start && updatedDate < new Date(filters.dateRange.start)) return false;
                if (filters.dateRange.end && updatedDate > new Date(filters.dateRange.end)) return false;
            }

            // Reorder filter
            if (filters.reorderOnly && item.stockLevel > item.reorderPoint) {
                return false;
            }

            return true;
        });
    }, [items, filters]);

    // Manual Pagination Slicing (Simulating Server-Side)
    const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
    const paginatedData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        return filteredData.slice(start, start + pagination.pageSize);
    }, [filteredData, pagination]);

    // Column Definitions
    const columns = useMemo<ColumnDef<InventoryItem>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllPageRowsSelected(),
                            indeterminate: table.getIsSomePageRowsSelected(),
                            onChange: table.getToggleAllPageRowsSelectedHandler(),
                            className: "w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-brand-teal focus:ring-brand-teal/50",
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                            className: "w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-brand-teal focus:ring-brand-teal/50",
                        }}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: 'Product Name',
                cell: ({ row }) => {
                    const name = row.original.name;
                    const search = filters.search;

                    if (!search) return (
                        <div className="flex flex-col cursor-pointer" onClick={() => dispatch(selectItem(row.original.id))}>
                            <span className="font-bold text-slate-900 dark:text-white hover:text-brand-teal transition-colors">{name}</span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">{row.original.sku}</span>
                        </div>
                    );

                    const parts = name.split(new RegExp(`(${search})`, 'gi'));
                    return (
                        <div className="flex flex-col cursor-pointer" onClick={() => dispatch(selectItem(row.original.id))}>
                            <span className="font-bold text-slate-900 dark:text-white hover:text-brand-teal transition-colors">
                                {parts.map((part, i) =>
                                    part.toLowerCase() === search.toLowerCase()
                                        ? <mark key={i} className="bg-brand-teal/30 text-slate-900 dark:text-white px-0.5 rounded-sm">{part}</mark>
                                        : part
                                )}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">{row.original.sku}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'category',
                header: 'Category',
                cell: ({ getValue }) => <span className="text-slate-600 dark:text-slate-300 text-xs font-medium bg-slate-100 dark:bg-white/5 px-2 py-1 rounded" > {getValue() as string} </span>,
            },
            {
                accessorKey: 'supplier',
                header: 'Supplier',
                cell: ({ getValue }) => <span className="text-slate-500 dark:text-slate-400 text-xs" > {getValue() as string} </span>,
            },
            {
                accessorKey: 'stockLevel',
                header: 'Stock Status',
                cell: ({ row }) => {
                    const stock = row.original.stockLevel;
                    const min = row.original.minStock;
                    const max = row.original.maxStock;
                    const percentage = Math.min((stock / max) * 100, 100);

                    let color = 'bg-brand-teal';
                    if (stock <= min) color = 'bg-red-500';
                    else if (stock <= min * 2) color = 'bg-orange-500';

                    return (
                        <div className="flex flex-col gap-1.5 w-32">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className={stock <= min ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}>{stock} {row.original.unit}</span>
                                <span className="text-slate-400">Target: {max}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${color} transition-all duration-500 rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'unitPrice',
                header: 'Price',
                cell: ({ getValue }) => <span className="font-black text-slate-900 dark:text-white" > ₹{(getValue() as number).toLocaleString()} </span>,
            },
            {
                accessorKey: 'lastUpdated',
                header: 'Updated',
                cell: ({ getValue }) => {
                    const date = new Date(getValue() as string);
                    return <span className="text-[10px] font-bold uppercase text-slate-400" > {format(date, 'MMM dd')} </span>;
                }
            },
            {
                id: 'actions',
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(selectItem(row.original.id));
                                }}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-brand-teal rounded-lg transition-colors"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete ${row.original.name}?`)) {
                                        dispatch(deleteItems([row.original.id]));
                                    }
                                }}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
        ],
        [dispatch, filters]
    );

    // Handlers
    const handlePaginationChange = (updater: Updater<PaginationState>) => {
        const nextState = typeof updater === 'function'
            ? updater(pagination)
            : updater;
        dispatch(setPagination(nextState));
    };

    const handleRowSelectionChange = (updater: Updater<Record<string, boolean>>) => {
        const nextState = typeof updater === 'function'
            ? updater(rowSelection)
            : updater;
        dispatch(setRowSelection(nextState));
    };

    const table = useReactTable({
        data: paginatedData, // Use sliced data
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
        pageCount, // Total pages
        manualPagination: true, // Tell table we are handling pagination
        enableRowSelection: true,
        getRowId: row => row.id, // Important for row selection
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // No pagination row model needed for manual pagination
    });

    return { table, globalFilter: filters.search, setGlobalFilter: (val: string) => dispatch(setSearch(val)) };
}
