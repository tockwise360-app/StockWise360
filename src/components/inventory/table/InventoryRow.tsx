import React from 'react';
import { flexRender, Row } from '@tanstack/react-table';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
// Note: IndeterminateCheckbox should be passed as a prop or imported if shared.
// For now assuming it's rendered by the cell definition, but we need to handle row click.

interface InventoryRowProps {
    row: Row<InventoryItem>;
    onClick: () => void;
    onNameClick: () => void;
}

export function InventoryRow({ row, onClick, onNameClick }: InventoryRowProps) {
    const isSelected = row.getIsSelected();

    return (
        <tr
            onClick={onClick}
            className={cn(
                "group relative transition-all duration-200 cursor-pointer border-b last:border-0",
                "border-slate-200 dark:border-white/5", // Border
                "hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:shadow-[inset_4px_0_0_0_rgba(20,184,166,0.8)]", // Hover: Light bg + Teal accent border
                isSelected && "bg-teal-50/50 dark:bg-teal-500/10 shadow-[inset_4px_0_0_0_rgba(20,184,166,0.8)]"
            )}
        >
            {row.getVisibleCells().map(cell => {
                // Stop propagation for checkbox interactions so they don't trigger row click
                if (cell.column.id === 'select') {
                    return (
                        <td key={cell.id} className="px-6 py-4 w-12" onClick={(e) => e.stopPropagation()}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    );
                }

                // Enhanced Name Column with Chevron
                if (cell.column.id === 'name') {
                    return (
                        <td key={cell.id} className="px-6 py-4">
                            <div
                                className="flex items-center justify-between group-hover:translate-x-1 transition-transform duration-200 cursor-pointer text-slate-900 dark:text-slate-100 font-medium hover:text-brand-teal"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNameClick();
                                }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                <ChevronRight
                                    size={16}
                                    className="text-brand-teal opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                />
                            </div>
                        </td>
                    );
                }

                return (
                    <td key={cell.id} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                );
            })}
        </tr>
    );
}
