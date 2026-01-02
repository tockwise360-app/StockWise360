'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, DollarSign } from 'lucide-react';

const HEALTH_SCORE = 78;

export function BusinessHealthCard() {
    const data = [
        { value: HEALTH_SCORE }, { value: 100 - HEALTH_SCORE }
    ];

    return (
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col group hover:bg-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="w-24 h-24 bg-brand-teal/20 rounded-full blur-2xl"></div>
            </div>

            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Health Score</h3>
                    <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mt-1">Real-time Analysis</p>
                </div>
                <div className="px-2 py-1 bg-brand-teal/10 border border-brand-teal/20 rounded-lg text-xs font-bold text-brand-teal uppercase tracking-widest">
                    Updated Now
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative my-4">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 border-[12px] border-white/5 rounded-full"></div>
                </div>

                <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={220}
                            endAngle={-40}
                            innerRadius={70}
                            outerRadius={85}
                            cornerRadius={10}
                            dataKey="value"
                            stroke="none"
                            paddingAngle={5}
                        >
                            <Cell fill="#14b8a6" style={{ filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.4))' }} />
                            <Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-5xl font-black text-white tracking-tight">{HEALTH_SCORE}</span>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Excellent</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto">
                {[
                    { label: 'Sales', icon: TrendingUp, val: '+12%', color: 'text-brand-teal' },
                    { label: 'Stock', icon: Activity, val: '98%', color: 'text-cyan-400' },
                    { label: 'Cash', icon: DollarSign, val: 'OK', color: 'text-brand-teal' },
                ].map((stat, i) => (
                    <div key={i} className="bg-black/20 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-colors">
                        <stat.icon className={`w-4 h-4 mb-1 ${stat.color}`} />
                        <span className="text-sm font-bold text-white">{stat.val}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
