'use client';

import { useState } from 'react';
import { useChartColors } from '@/lib/utils/chartColors';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { TurnoverDrilldown } from '@/components/dashboard/drilldowns/TurnoverDrilldown';

const DATA = [
    { name: 'Electronics', turnover: 4.2, benchmark: 3.5 },
    { name: 'Fashion', turnover: 2.8, benchmark: 3.0 },
    { name: 'Home', turnover: 3.5, benchmark: 2.5 },
    { name: 'Grocery', turnover: 8.5, benchmark: 6.0 },
    { name: 'Toys', turnover: 1.5, benchmark: 2.0 },
];

export function InventoryTurnoverChart() {
    const [filter, setFilter] = useState('7D');
    const [showDrilldown, setShowDrilldown] = useState(false);
    const colors = useChartColors();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex bg-slate-100 dark:bg-dark-base rounded-lg p-1">
                    {['7D', '30D', '90D'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilter(p)}
                            className={cn(
                                "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                filter === p ? "bg-white dark:bg-slate-700 text-brand-teal shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowDrilldown(true)}
                    className="p-2 text-slate-400 hover:text-brand-teal hover:bg-slate-100 dark:hover:bg-dark-base rounded-lg transition-all"
                    title="View Detailed Report"
                >
                    <Maximize2 size={16} />
                </button>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={DATA} margin={{ top: 20, right: 0, bottom: 0, left: -20 }}>
                        <CartesianGrid stroke={colors.grid} vertical={false} />
                        <XAxis
                            dataKey="name"
                            scale="band"
                            tick={{ fontSize: 11, fill: colors.text, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: colors.text }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                color: colors.text,
                                border: `1px solid ${colors.grid}`,
                                borderRadius: '12px'
                            }}
                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            wrapperStyle={{ fontSize: '11px', fontWeight: '500', color: colors.text }}
                        />
                        <Bar
                            dataKey="turnover"
                            barSize={24}
                            fill={colors.secondary}
                            name="Your Turnover"
                            radius={[6, 6, 0, 0]}
                            fillOpacity={0.8}
                            onClick={() => setShowDrilldown(true)}
                            cursor="pointer"
                        />
                        <Line
                            type="monotone"
                            dataKey="benchmark"
                            stroke={colors.success}
                            strokeWidth={3}
                            name="Industry Avg"
                            dot={{ r: 4, fill: isDark ? '#1E293B' : '#FFFFFF', stroke: colors.success, strokeWidth: 2 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <Modal
                isOpen={showDrilldown}
                onClose={() => setShowDrilldown(false)}
                title="Inventory Turnover & Slow Moving Items"
                className="max-w-4xl"
            >
                <TurnoverDrilldown />
            </Modal>
        </div>
    );
}
