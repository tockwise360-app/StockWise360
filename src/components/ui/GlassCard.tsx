import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
    interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, children, hoverEffect = false, interactive = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Base Glassmorphism Styles (Light/Dark)
                    "relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-300 ease-out",
                    "border border-white/20 dark:border-white/10", // Border adaptation

                    // Background Gradient
                    // Light: White with slight transparency
                    // Dark: Deep Navy/Slate
                    "bg-white/70 dark:bg-gradient-to-br dark:from-[#0f172a]/80 dark:to-[#1e1b4b]/60",

                    // Interactive / Hover States
                    (hoverEffect || interactive) && [
                        "hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30",
                        "hover:border-teal-500/30 dark:hover:border-lime-400/50",
                        "active:scale-[0.98]",
                        "cursor-pointer"
                    ],

                    className
                )}
                {...props}
            >
                {/* Subtle inner glow/noise texture could be added here if needed */}
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";
