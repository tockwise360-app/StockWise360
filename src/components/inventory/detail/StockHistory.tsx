import React from 'react';
import { InventoryItem } from '@/lib/store/features/inventorySlice';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, FileText } from 'lucide-react';

interface StockHistoryProps {
    item: InventoryItem;
}

export function StockHistory({ item }: StockHistoryProps) {
    if (!item.history || item.history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 animate-in fade-in">
                <FileText size={32} className="mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-wider">No history recorded</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-2">
                {item.history.map((entry, idx) => (
                    <div
                        key={entry.id || idx}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-white/5"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${entry.status === 'pos'
                                ? 'bg-brand-teal/10 text-brand-teal'
                                : entry.status === 'neg'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-orange-500/10 text-orange-500'
                            }`}>
                            {entry.type === 'Stock In' && <ArrowUpRight size={18} />}
                            {entry.type === 'Stock Out' && <ArrowDownLeft size={18} />}
                            {entry.type === 'Adjustment' && <RefreshCw size={18} />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{entry.reason}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{entry.notes || 'No adjustment notes'}</p>
                        </div>

                        <div className="text-right">
                            <span className={`block text-xs font-black ${entry.status === 'pos' ? 'text-brand-teal' : 'text-red-500'
                                }`}>
                                {entry.status === 'pos' ? '+' : '-'}{entry.amount}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                                {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-teal transition-colors">
                View Full History
            </button>
        </div>
    );
}
