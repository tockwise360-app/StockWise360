'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItemProps {
    label: string;
    href: string;
    icon: LucideIcon;
    isActive?: boolean;
    isNested?: boolean;
    onClick?: () => void;
}

export function SidebarItem({
    label,
    href,
    icon: Icon,
    isActive = false,
    isNested = false,
    onClick
}: SidebarItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isNested && "pl-11",
                isActive
                    ? "bg-teal-500/10 text-teal-500 dark:text-teal-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
            )}
        >
            {/* Active Indicator */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full" />
            )}

            {/* Icon */}
            <Icon size={18} className="flex-shrink-0" />

            {/* Label */}
            <span className="text-sm font-medium truncate">{label}</span>
        </Link>
    );
}
