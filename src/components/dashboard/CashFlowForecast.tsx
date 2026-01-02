'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Info, ChevronRight, BarChart2 } from 'lucide-react';
import { useChartColors } from '@/lib/utils/chartColors';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { CashFlowDrilldown } from '@/components/dashboard/drilldowns/CashFlowDrilldown';

const DATA = [
    { month: 'Jan', actual: 4500, forecast: 4500, low: 4500, high: 4500 },
    { month: 'Feb', actual: 5200, forecast: 5200, low: 5200, high: 5200 },
    { month: 'Mar', actual: 4800, forecast: 4800, low: 4800, high: 4800 },
    { month: 'Apr', actual: null, forecast: 5800, low: 5200, high: 6400 },
    { month: 'May', actual: null, forecast: 6200, low: 5400, high: 7200 },
    { month: 'Jun', actual: null, forecast: 6500, low: 5100, high: 8100 },
];

export function CashFlowForecast() {
    const [period, setPeriod] = useState('Next 3M');
    const [showDrilldown, setShowDrilldown] = useState(false);
    const colors = useChartColors();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Forecast Period</h4>
                    <div className="flex bg-slate-100 dark:bg-dark-base rounded-lg p-1">
                        {['Next 3M', 'Yearly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                    period === p ? "bg-white dark:bg-slate-700 text-brand-teal shadow-sm" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-dark-base rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">AI Engine Active</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="actualFlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="forecastFlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: colors.text }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: colors.text }}
                            tickFormatter={(val) => `₹${val / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                color: colors.text,
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                        />
                        {/* Confidence Interval Band */}
                        <Area
                            type="monotone"
                            dataKey="high"
                            stroke="none"
                            fill="#94a3b8"
                            fillOpacity={0.1}
                        />
                        <Area
                            type="monotone"
                            dataKey="low"
                            stroke="none"
                            fill={isDark ? '#0f172a' : '#fff'}
                            fillOpacity={1}
                        />

                        {/* Forecast Line */}
                        <Area
                            type="monotone"
                            dataKey="forecast"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="url(#forecastFlow)"
                        />

                        {/* Actual Line */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#14b8a6"
                            strokeWidth={4}
                            fill="url(#actualFlow)"
                            activeDot={{ r: 6, fill: '#14b8a6' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            <div className="mt-6 space-y-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-start gap-3">
                    <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                    <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium leading-normal">
                        <span className="font-bold">Growth Alert:</span> Cash flow is projected to increase by 18% in Q3 due to decreasing inventory overhead.
                    </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl flex items-start gap-3">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                    <p className="text-[10px] text-amber-800 dark:text-amber-400 font-medium leading-normal">
                        <span className="font-bold">Risk Factor:</span> Potential ₹12k shortfall in May if overdue invoices aren't collected by Apr 25.
                    </p>
                </div>
            </div>

            <button
                onClick={() => setShowDrilldown(true)}
                className="mt-4 w-full py-2 flex items-center justify-center gap-1 text-[10px] font-black text-brand-teal uppercase tracking-widest hover:gap-2 transition-all group"
            >
                View Daily Breakdown & Scenarios <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <Modal
                isOpen={showDrilldown}
                onClose={() => setShowDrilldown(false)}
                title="Cash Flow Breakdown"
                className="max-w-4xl"
            >
                <CashFlowDrilldown />
            </Modal>
        </div>
    );
}
