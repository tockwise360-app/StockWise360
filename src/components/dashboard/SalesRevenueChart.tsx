'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, FileDown, Calendar, Layers, ExternalLink } from 'lucide-react';
import { useChartColors } from '@/lib/utils/chartColors';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { RevenueDrilldown } from '@/components/dashboard/drilldowns/RevenueDrilldown';

const MOCK_DATA = Array.from({ length: 15 }, (_, i) => ({
    date: `${i + 1} Dec`,
    revenue: Math.floor(Math.random() * 5000) + 3000,
    prev: Math.floor(Math.random() * 4000) + 2000,
}));

export function SalesRevenueChart() {
    const [filter, setFilter] = useState('30d');
    const [granularity, setGranularity] = useState('daily');
    const [showComparison, setShowComparison] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showDrilldown, setShowDrilldown] = useState(false);
    const colors = useChartColors();
    const { theme } = useTheme();

    const handleExportImage = () => {
        setIsExporting(true);
        // Simulate chart export
        setTimeout(() => {
            setIsExporting(false);
            alert("Chart exported as PNG successfully!");
        }, 1200);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <div
                        onClick={() => setShowDrilldown(true)}
                        className="group cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-teal transition-colors">₹42,500</span>
                            <div className="flex items-center px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-xs font-black text-emerald-600 dark:text-emerald-400">
                                <TrendingUp size={14} strokeWidth={3} className="mr-1" /> 12.5%
                            </div>
                            <ExternalLink size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-widest group-hover:text-brand-teal/80 transition-colors">Revenue Growth (Last 30 Days)</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Period Toggle */}
                    <div className="flex bg-slate-100 dark:bg-dark-base rounded-xl p-1 relative">
                        {['7D', '30D', '90D', 'Custom'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f.toLowerCase())}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    filter === f.toLowerCase()
                                        ? "bg-white dark:bg-slate-700 text-brand-teal shadow-md"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}

                        {/* Fake Date Picker for 'Custom' */}
                        {filter === 'custom' && (
                            <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl z-50 animate-in zoom-in-95 duration-200 min-w-[280px]">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Custom Range</h5>
                                    <button onClick={() => setFilter('30d')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">✕</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2 bg-slate-100 dark:bg-dark-base rounded-lg outline-none cursor-not-allowed opacity-60">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase">Start</p>
                                        <p className="text-xs font-bold">01 Dec, 2025</p>
                                    </div>
                                    <div className="p-2 bg-slate-100 dark:bg-dark-base rounded-lg outline-none cursor-not-allowed opacity-60">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase">End</p>
                                        <p className="text-xs font-bold">21 Dec, 2025</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-brand-teal text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-500/10">Apply Range</button>
                            </div>
                        )}
                    </div>

                    {/* Comparison Button */}
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            showComparison
                                ? "bg-brand-teal border-brand-teal text-white shadow-lg shadow-teal-500/20"
                                : "bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-brand-teal"
                        )}
                    >
                        <Layers size={14} />
                        {showComparison ? 'Comparison On' : 'Compare'}
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={handleExportImage}
                        disabled={isExporting}
                        className={cn(
                            "p-2 bg-slate-100 dark:bg-dark-base text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white rounded-xl transition-all",
                            isExporting && "animate-pulse opacity-50"
                        )}
                    >
                        <FileDown size={20} />
                    </button>
                </div>
            </div>

            {/* Granularity Toggle */}
            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Granularity:</span>
                </div>
                <div className="flex gap-4">
                    {['daily', 'weekly', 'monthly'].map(g => (
                        <button
                            key={g}
                            onClick={() => setGranularity(g)}
                            className={cn(
                                "text-xs font-bold transition-all capitalize",
                                granularity === g ? "text-brand-teal underline decoration-2 underline-offset-4" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors.primary} stopOpacity={theme === 'dark' ? 0.4 : 0.3} />
                                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: colors.text }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: colors.text }}
                            tickFormatter={(value) => `₹${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                color: colors.text,
                                border: `1px solid ${colors.grid}`,
                                borderRadius: '16px',
                                padding: '12px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            cursor={{ stroke: colors.grid, strokeWidth: 2 }}
                        />
                        {showComparison && (
                            <Area
                                type="monotone"
                                dataKey="prev"
                                stroke="#94a3b8"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrev)"
                            />
                        )}
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={colors.primary}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 8, fill: theme === 'dark' ? '#fff' : colors.primary, stroke: colors.primary, strokeWidth: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Payment Method Breakdown Mock */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Sources:</p>
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-teal" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Bank Transfer (58%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cash (28%)</span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showDrilldown}
                onClose={() => setShowDrilldown(false)}
                title="Revenue Analytics & Invoices"
                className="max-w-4xl"
            >
                <RevenueDrilldown />
            </Modal>
        </div>
    );
}

