import React, { useState } from 'react';
import { InventoryItem, adjustStock } from '@/lib/store/features/inventorySlice';
import { useAppDispatch } from '@/lib/store/hooks';
import { Plus, Minus, ArrowRight, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockAdjustmentFormProps {
    item: InventoryItem;
}

export function StockAdjustmentForm({ item }: StockAdjustmentFormProps) {
    const dispatch = useAppDispatch();
    const [type, setType] = useState<'add' | 'remove' | 'set'>('add');
    const [amount, setAmount] = useState<number>(1);
    const [reason, setReason] = useState('Restock');
    const [note, setNote] = useState('');

    const reasons = {
        add: ['Restock', 'Return Received', 'Inventory Count', 'Correction'],
        remove: ['Sales Order', 'Damaged', 'Lost/Stolen', 'Expired', 'Internal Use'],
        set: ['Annual Audit', 'Correction']
    };

    const handleConfirm = () => {
        dispatch(adjustStock({
            id: item.id,
            amount,
            type,
            reason,
            notes: note
        }));
        // Reset form
        setAmount(1);
        setNote('');
    };

    const projectedStock =
        type === 'add' ? item.stockLevel + amount :
            type === 'remove' ? Math.max(0, item.stockLevel - amount) :
                amount;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Type Selector */}
            <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                {(['add', 'remove', 'set'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => { setType(t); setReason(reasons[t][0]); }}
                        className={cn(
                            "flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                            type === t
                                ? "bg-white dark:bg-slate-700 shadow-sm text-brand-teal"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        {t === 'add' ? 'Add Stock' : t === 'remove' ? 'Remove' : 'Set Count'}
                    </button>
                ))}
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setAmount(Math.max(1, amount - 1))}
                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all text-slate-500"
                    >
                        <Minus size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-center text-xl font-bold outline-none ring-offset-2 focus:ring-2 ring-brand-teal/50"
                        />
                    </div>
                    <button
                        onClick={() => setAmount(amount + 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all text-slate-500"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Reason Select */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason Code</label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-brand-teal/50"
                >
                    {reasons[type].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            {/* Projection Preview */}
            <div className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Current</span>
                    <div className="text-xl font-bold text-slate-500">{item.stockLevel}</div>
                </div>
                <ArrowRight size={20} className="text-slate-300" />
                <div className="text-right">
                    <span className="text-[10px] font-bold text-brand-teal uppercase">New Level</span>
                    <div className="text-xl font-black text-brand-teal">{projectedStock}</div>
                </div>
            </div>

            <button
                onClick={handleConfirm}
                disabled={amount <= 0}
                className="w-full py-4 bg-brand-teal hover:bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
                <Save size={16} className="group-hover:scale-110 transition-transform" />
                Confirm Adjustment
            </button>
        </div>
    );
}
