import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { closeDetail, openAdjustmentModal, adjustStock, updateReorderSettings } from '@/lib/store/features/inventorySlice';
import { X, TrendingUp, Flag, History, Truck, DollarSign, ArrowUpRight, ArrowDownRight, Settings, Info, Brain } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useChartColors } from '@/lib/utils/chartColors';
import { useTheme } from '@/lib/context/ThemeContext';



type TabType = 'overview' | 'history' | 'forecast';

export function ProductDetailPanel() {
    const dispatch = useAppDispatch();
    const { selectedItemId, isDetailOpen, items } = useAppSelector((state) => state.inventory);
    const colors = useChartColors();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [historyPage, setHistoryPage] = useState(1);
    const historyPerPage = 5;

    const product = items.find(i => i.id === selectedItemId);

    if (!isDetailOpen || !product) return null;

    const margin = ((product.unitPrice - product.costPrice) / product.unitPrice) * 100;

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] transition-opacity duration-300"
                onClick={() => dispatch(closeDetail())}
            />
            {/* Slide Over */}
            <div className="fixed inset-y-0 right-0 z-[101] w-full md:w-[520px] bg-white dark:bg-dark-surface border-l border-slate-200 dark:border-white/5 shadow-2xl transform transition-transform duration-500 ease-out flex flex-col animate-in slide-in-from-right duration-500">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-white/70 dark:bg-dark-surface/70 backdrop-blur-2xl relative overflow-hidden">
                    {/* Background Decorator */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center shadow-lg">
                                    <span className="text-white font-black text-xs">S</span>
                                </div>
                                <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] bg-brand-teal/10 px-2 py-1 rounded">
                                    {product.sku}
                                </span>
                                <span className={cn(
                                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                    product.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' :
                                        product.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-red-500/10 text-red-500'
                                )}>
                                    {product.status}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{product.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">{product.category}</p>
                        </div>
                        <button
                            onClick={() => dispatch(closeDetail())}
                            className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-8 mt-8 border-b border-transparent">
                        {(['overview', 'history', 'forecast'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-3 text-xs font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab
                                        ? "text-brand-teal"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-teal rounded-full animate-in fade-in slide-in-from-bottom-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-brand-teal/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Available Stock</p>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => dispatch(adjustStock({ id: product.id, amount: 5, type: 'remove', reason: 'Quick Correction' }))}
                                                className="w-6 h-6 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-[10px] font-bold"
                                            >
                                                -5
                                            </button>
                                            <button
                                                onClick={() => dispatch(adjustStock({ id: product.id, amount: 5, type: 'add', reason: 'Quick Restock' }))}
                                                className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-bold"
                                            >
                                                +5
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">{product.stockLevel}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.unit}</span>
                                    </div>
                                    <div className="mt-4 h-1.5 w-full bg-white dark:bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-teal rounded-full"
                                            style={{ width: `${Math.min(100, (product.stockLevel / product.maxStock) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-brand-teal/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Gross Margin</p>
                                        <DollarSign size={14} className="text-brand-teal" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-brand-teal">{margin.toFixed(1)}%</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profit</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                        <ArrowUpRight size={12} /> Above Avg
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Specs */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <Info size={14} className="text-brand-teal" /> Specifications
                                </h3>
                                <div className="bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5">
                                    <div className="flex justify-between p-4 px-6 items-center">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Unit Price</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white font-mono">₹{product.unitPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-4 px-6 items-center">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cost Price</span>
                                        <span className="text-sm font-black text-slate-400 font-mono">₹{product.costPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-4 px-6 items-center">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lead Time</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{product.leadTime} Days</span>
                                    </div>
                                    <div className="flex justify-between p-4 px-6 items-center">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Preferred Supplier</span>
                                        <div className="flex items-center gap-2">
                                            <Truck size={14} className="text-brand-teal" />
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{product.supplier}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Automation Info */}
                            <div className="p-8 bg-brand-teal/5 dark:bg-brand-teal/10 rounded-3xl border border-brand-teal/20 relative overflow-hidden group">
                                <Settings className="absolute -right-4 -top-4 w-24 h-24 text-brand-teal/10 group-hover:rotate-45 transition-transform duration-[2000ms]" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-sm font-black text-brand-teal uppercase tracking-widest">Reorder Automation</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Smart Inventory Management</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (product) {
                                                    dispatch(updateReorderSettings({
                                                        id: product.id,
                                                        reorderPoint: product.reorderPoint,
                                                        autoReorder: !product.autoReorder,
                                                        minOrderQuantity: product.minOrderQuantity
                                                    }));
                                                }
                                            }}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                                                product.autoReorder ? "bg-brand-teal" : "bg-slate-300 dark:bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                                                product.autoReorder ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Reorder Point</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={product.reorderPoint}
                                                        onBlur={(e) => {
                                                            dispatch(updateReorderSettings({
                                                                id: product.id,
                                                                reorderPoint: parseInt(e.target.value),
                                                                autoReorder: product.autoReorder,
                                                                minOrderQuantity: product.minOrderQuantity
                                                            }));
                                                        }}
                                                        className="w-full bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-brand-teal/50 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Min. Order Qty</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={product.minOrderQuantity}
                                                        onBlur={(e) => {
                                                            dispatch(updateReorderSettings({
                                                                id: product.id,
                                                                reorderPoint: product.reorderPoint,
                                                                autoReorder: product.autoReorder,
                                                                minOrderQuantity: parseInt(e.target.value)
                                                            }));
                                                        }}
                                                        className="w-full bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-brand-teal/50 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-white dark:border-white/5">
                                            {product.autoReorder
                                                ? `The system is set to automatically generate a Purchase Order when stock falls below ${product.reorderPoint} ${product.unit}.`
                                                : "Automatic reordering is currently disabled for this item. Low stock alerts will still be triggered."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Stock Movements</h3>
                                <button className="text-[10px] font-black text-brand-teal uppercase tracking-widest">Download Report</button>
                            </div>
                            <div className="space-y-4">
                                {product.history.length > 0 ? (
                                    <>
                                        {product.history.slice((historyPage - 1) * historyPerPage, historyPage * historyPerPage).map((entry) => (
                                            <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-teal/20 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                                                        entry.status === 'pos' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                                    )}>
                                                        {entry.status === 'pos' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{entry.type}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{entry.reason}</p>
                                                        {entry.notes && <p className="text-[10px] text-slate-400 mt-1 italic">"{entry.notes}"</p>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={cn("text-lg font-black", entry.status === 'pos' ? "text-emerald-500" : "text-rose-500")}>
                                                        {entry.status === 'pos' ? '+' : '-'}{entry.amount}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{format(new Date(entry.date), 'MMM dd, HH:mm')}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Pagination Controls */}
                                        {product.history.length > historyPerPage && (
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                                <button
                                                    disabled={historyPage === 1}
                                                    onClick={() => setHistoryPage(p => p - 1)}
                                                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-teal disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    Page <span className="text-brand-teal">{historyPage}</span> / {Math.ceil(product.history.length / historyPerPage)}
                                                </span>
                                                <button
                                                    disabled={historyPage >= Math.ceil(product.history.length / historyPerPage)}
                                                    onClick={() => setHistoryPage(p => p + 1)}
                                                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-teal disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                                            <History className="text-slate-300" size={32} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No transaction history</p>
                                            <p className="text-[10px] text-slate-500 mt-1 font-medium">Recorded movements will appear here.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {product.history.length > 5 && (
                                <button className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl hover:border-brand-teal/30 hover:text-brand-teal transition-all">
                                    View Full Transaction Log
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'forecast' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                <TrendingUp className="absolute -right-4 -top-4 w-24 h-24 text-brand-teal/5 group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">AI Demand Forecast</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Next 14 Days Projection • 89% Confidence</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                <span className="text-[9px] font-black text-slate-500 uppercase">Historical</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-teal/10 rounded-full border border-brand-teal/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                                <span className="text-[9px] font-black text-brand-teal uppercase">Predicted</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={[
                                                { day: 'M', historical: 45, predicted: 45, ci_low: 40, ci_high: 50 },
                                                { day: 'T', historical: 52, predicted: 52, ci_low: 46, ci_high: 58 },
                                                { day: 'W', historical: 48, predicted: 48, ci_low: 42, ci_high: 54 },
                                                { day: 'T', predicted: 55, ci_low: 48, ci_high: 62 },
                                                { day: 'F', predicted: 68, ci_low: 60, ci_high: 76 },
                                                { day: 'S', predicted: 85, ci_low: 75, ci_high: 95 },
                                                { day: 'S', predicted: 78, ci_low: 68, ci_high: 88 },
                                                { day: 'M', predicted: 60, ci_low: 52, ci_high: 68 },
                                                { day: 'T', predicted: 58, ci_low: 50, ci_high: 66 },
                                                { day: 'W', predicted: 62, ci_low: 54, ci_high: 70 },
                                            ]}>
                                                <defs>
                                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                                                <XAxis
                                                    dataKey="day"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: colors.text, fontSize: 10, fontWeight: 700 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: theme === 'dark' ? '#0F172A' : '#fff',
                                                        border: `1px solid ${colors.grid}`,
                                                        borderRadius: '16px',
                                                        fontSize: '10px',
                                                        fontWeight: '700',
                                                        color: colors.text,
                                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                                                    }}
                                                    cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '4 4' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="ci_high"
                                                    stroke="none"
                                                    fill={colors.primary}
                                                    fillOpacity={0.05}
                                                    connectNulls
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="ci_low"
                                                    stroke="none"
                                                    fill={theme === 'dark' ? '#0F172A' : '#f8fafc'}
                                                    fillOpacity={0.5}
                                                    connectNulls
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="historical"
                                                    stroke="#94a3b8"
                                                    strokeWidth={2}
                                                    fill="transparent"
                                                    dot={{ r: 3, fill: '#94a3b8', strokeWidth: 0 }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="predicted"
                                                    stroke={colors.primary}
                                                    strokeWidth={3}
                                                    fill="url(#colorForecast)"
                                                    strokeDasharray="5 5"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-8 flex items-start gap-4 p-4 bg-brand-teal/5 dark:bg-white/5 rounded-2xl border border-brand-teal/10 dark:border-white/5">
                                        <div className="w-10 h-10 bg-brand-teal text-white rounded-xl flex items-center justify-center shrink-0">
                                            <Brain size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">AI Strategy Recommendation</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                                                Demand for <span className="text-brand-teal font-bold">{product.name}</span> is projected to peak in 4 days.
                                                We recommend increasing stock by <span className="text-brand-teal font-bold">25%</span> above usual levels to capture weekend traffic.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-dark-surface backdrop-blur-xl">
                    <div className="flex gap-4">
                        <button
                            onClick={() => dispatch(openAdjustmentModal())}
                            className="flex-[2] py-4 bg-brand-teal hover:bg-teal-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-[0.98]"
                        >
                            Adjust Stock / Reorder
                        </button>
                        <button className="flex-1 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all border border-slate-200 dark:border-white/10 active:scale-[0.98]">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
