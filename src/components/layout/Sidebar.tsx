'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    CreditCard,
    Users,
    PieChart,
    Bot,
    Settings,
    FileText,
    AlertTriangle,
    RefreshCw,
    Plus,
    History,
    Palette
} from 'lucide-react';
import { SidebarSection } from './SidebarSection';
import { cn } from '@/lib/utils';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === path;
        return pathname.startsWith(path);
    };

    const navigation = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            isActive: isActive('/dashboard')
        },
        {
            label: 'Inventory',
            icon: Package,
            isActive: isActive('/inventory'),
            items: [
                { label: 'All Items', href: '/inventory', icon: Package, isActive: pathname === '/inventory' },
                { label: 'Low Stock', href: '/inventory?filter=low-stock', icon: AlertTriangle, isActive: false },
                { label: 'Reorder', href: '/inventory?filter=reorder', icon: RefreshCw, isActive: false },
            ]
        },
        {
            label: 'Billing',
            icon: CreditCard,
            isActive: isActive('/invoices'),
            items: [
                { label: 'Create Invoice', href: '/invoices/new', icon: Plus, isActive: pathname === '/invoices/new' },
                { label: 'Invoice History', href: '/invoices', icon: History, isActive: pathname === '/invoices' },
                { label: 'Templates', href: '/invoices/templates', icon: Palette, isActive: pathname === '/invoices/templates' },
            ]
        },
        {
            label: 'Customers',
            icon: Users,
            isActive: isActive('/customers'),
            items: [
                { label: 'All Customers', href: '/customers', icon: Users, isActive: pathname === '/customers' },
                { label: 'Credit Tracking', href: '/customers?tab=credit', icon: CreditCard, isActive: false },
            ]
        },
        {
            label: 'Reports',
            icon: PieChart,
            href: '/reports',
            isActive: isActive('/reports')
        },
        {
            label: 'AI Assistant',
            icon: Bot,
            href: '/ai-assistant',
            isActive: isActive('/ai-assistant')
        },
        {
            label: 'Settings',
            icon: Settings,
            href: '/settings',
            isActive: isActive('/settings')
        },
    ];

    return (
        <div className={cn("w-60 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-white/5", className)}>
            {/* Logo */}
            <div className="flex items-center gap-2 p-6 border-b border-slate-200 dark:border-dark-border">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    S
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                    StockWise<span className="text-teal-500">360</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {navigation.map((item) => (
                    <SidebarSection
                        key={item.label}
                        {...item}
                        defaultExpanded={item.isActive}
                    />
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-dark-border">
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    v1.0.0
                </div>
            </div>
        </div>
    );
}
