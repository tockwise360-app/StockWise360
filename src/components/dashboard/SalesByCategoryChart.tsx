'use client';

import { useTheme } from '@/lib/context/ThemeContext';
import { useChartColors } from '@/lib/utils/chartColors';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DATA = [
    { name: 'Electronics', value: 45000 },
    { name: 'Fashion', value: 32000 },
    { name: 'Home', value: 28000 },
    { name: 'Grocery', value: 15000 },
];

export function SalesByCategoryChart({ onCategoryClick }: { onCategoryClick?: (category: string) => void }) {
    const { theme } = useTheme();
    const colors = useChartColors();
    const isDark = theme === 'dark';

    const CATEGORY_COLORS = [colors.primary, colors.secondary, colors.warning, colors.success];

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-[250px] relative">
                {/* Center Decorator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 bg-brand-teal/10 dark:bg-white/5 rounded-full blur-xl"></div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            cornerRadius={8}
                            stroke="none"
                            onClick={(data) => onCategoryClick?.(data.name)}
                            className="cursor-pointer outline-none"
                        >
                            {DATA.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                    style={{
                                        filter: isDark ? `drop-shadow(0 0 4px ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}80)` : 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `₹${value.toLocaleString()}`}
                            contentStyle={{
                                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                color: colors.text,
                                border: `1px solid ${colors.grid}`,
                                borderRadius: '12px',
                                padding: '12px',
                                boxShadow: isDark ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: colors.text }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
