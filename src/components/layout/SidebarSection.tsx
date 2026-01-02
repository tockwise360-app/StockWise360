'use client';

import React, { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { SidebarItem, SidebarItemProps } from './SidebarItem';
import { cn } from '@/lib/utils';

export interface SidebarSectionProps {
    label: string;
    icon: LucideIcon;
    items?: Omit<SidebarItemProps, 'isNested'>[];
    href?: string;
    isActive?: boolean;
    defaultExpanded?: boolean;
}

export function SidebarSection({
    label,
    icon: Icon,
    items = [],
    href,
    isActive = false,
    defaultExpanded = false
}: SidebarSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || isActive);
    const hasSubItems = items.length > 0;

    // If no sub-items, render as a simple item
    if (!hasSubItems && href) {
        return <SidebarItem label={label} href={href} icon={Icon} isActive={isActive} />;
    }

    return (
        <div>
            {/* Section Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                    isActive
                        ? "bg-brand-teal/10 text-brand-teal"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                )}
            >
                {/* Active Indicator */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-teal rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                )}

                <div className="flex items-center gap-3">
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{label}</span>
                </div>

                {/* Chevron */}
                {hasSubItems && (
                    <ChevronDown
                        size={16}
                        className={cn(
                            "flex-shrink-0 transition-transform duration-200",
                            isExpanded && "rotate-180"
                        )}
                    />
                )}
            </button>

            {/* Sub-items */}
            {hasSubItems && isExpanded && (
                <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {items.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            isNested
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
