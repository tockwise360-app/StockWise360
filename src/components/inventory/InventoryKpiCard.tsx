import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryKpiCardProps {
    title: string;
    value: string;
    trend?: {
        value: string;
        direction: 'up' | 'down';
        label: string; // e.g. "vs last month"
    };
    icon: LucideIcon;
    color?: 'teal' | 'purple' | 'lime' | 'red' | 'orange';
    onClick?: () => void;
    detailStrip?: string; // Optional text to show on hover (slide up)
}

export function InventoryKpiCard({
    title,
    value,
    trend,
    icon: Icon,
    color = 'teal',
    onClick,
    detailStrip
}: InventoryKpiCardProps) {

    // Color mapping for the icon and accent effects
    const colors = {
        teal: 'text-cyan-400 group-hover:text-cyan-300',
        purple: 'text-violet-400 group-hover:text-violet-300',
        lime: 'text-lime-400 group-hover:text-lime-300',
        red: 'text-red-400 group-hover:text-red-300',
        orange: 'text-amber-400 group-hover:text-amber-300',
    };

    return (
        <div
            className={cn(
                "group relative p-0 overflow-hidden rounded-2xl transition-all duration-200 cursor-pointer",
                "border border-slate-200 dark:border-white/10", // Base border
                "hover:border-teal-500/50 dark:hover:border-teal-400/50", // Hover accent
                "shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                "ring-0 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none", // Focus ring

                // Background & Blur
                "bg-white/80 dark:bg-transparent backdrop-blur-xl", // Light mode base
                "dark:bg-gradient-to-br dark:from-[#0f172a]/85 dark:to-[#1e3a8a]/15" // Dark mode gradient
            )}
            onClick={onClick}
            tabIndex={0} // Make keyboard focusable
        >
            {/* Inner Padding container */}
            <div className="p-5 flex flex-col justify-between h-32 relative z-10">

                {/* Header: Label & Icon */}
                <div className="flex justify-between items-start">
                    <span className="text-[12px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        {title}
                    </span>
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border transition-colors",
                        // Light: subtle bg, Dark: white/5
                        "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/5",
                        colors[color]
                    )}>
                        <Icon size={16} />
                    </div>
                </div>

                {/* Main Value & Trend */}
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-slate-900 dark:text-slate-50 font-sans tracking-tight">
                            {value}
                        </span>
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-0.5 text-xs font-medium translate-y-[-2px]",
                                trend.direction === 'up' ? 'text-lime-300' : 'text-rose-300'
                            )}>
                                {trend.direction === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                <span>{trend.value} {trend.label}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom CTA Band */}
            <div className="h-9 w-full bg-slate-50 dark:bg-[#020617]/40 border-t border-slate-100 dark:border-white/5 flex items-center px-5 group-hover:bg-teal-50/50 dark:group-hover:bg-white/5 transition-colors">
                <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-slate-200 transition-colors flex items-center gap-1">
                    {detailStrip || "View Details"}
                </span>
            </div>

            {/* Hover Gradient Glow (Subtle) */}
            <div className={cn(
                "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                color === 'teal' && "bg-teal-500",
                color === 'purple' && "bg-violet-500",
                color === 'lime' && "bg-lime-500",
                color === 'red' && "bg-rose-500",
                color === 'orange' && "bg-amber-500",
            )} />
        </div>
    );
}
