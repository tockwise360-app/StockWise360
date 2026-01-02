'use client';

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRANSACTIONS = [
    { id: 1, type: 'Sale', party: 'TechGiant Corp', amount: 12500, status: 'Completed', date: '2 min ago' },
    { id: 2, type: 'Purchase', party: 'Global Suppliers', amount: 5400, status: 'Pending', date: '35 min ago' },
    { id: 3, type: 'Sale', party: 'Local Boutique', amount: 850, status: 'Completed', date: '2 hrs ago' },
    { id: 4, type: 'Sale', party: 'Online Customer', amount: 120, status: 'Failed', date: '4 hrs ago' },
    { id: 5, type: 'Purchase', party: 'Office Depot', amount: 230, status: 'Completed', date: '1 day ago' },
];

export function RecentTransactionsTable() {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col group hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Transactions</h3>
                <button className="text-xs font-bold text-brand-teal hover:underline transition-colors uppercase tracking-widest">See All</button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                        {TRANSACTIONS.map((tx) => (
                            <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-dark-base/50 transition-colors cursor-pointer">
                                <td className="py-3 px-2">
                                    <div className={cn(
                                        "p-2.5 rounded-xl w-fit",
                                        tx.type === 'Sale' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-brand-teal/10 text-brand-teal'
                                    )}>
                                        {tx.type === 'Sale' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                    </div>
                                </td>
                                <td className="py-3 px-2">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{tx.party}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{tx.date}</div>
                                </td>
                                <td className="py-3 px-2 text-right font-black text-slate-900 dark:text-white text-sm">
                                    ₹{tx.amount.toLocaleString()}
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                        tx.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' :
                                            tx.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-600' :
                                                'bg-red-50 dark:bg-red-900/10 text-red-600'
                                    )}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
