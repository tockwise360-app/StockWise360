'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Box, FileText, Users, BarChart2, Settings,
    ChevronLeft, ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    submenu?: { name: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {
        name: 'Inventory',
        href: '/inventory',
        icon: Box,
        submenu: [
            { name: 'All Items', href: '/inventory' },
            { name: 'Low Stock Alerts', href: '/inventory/alerts' },
            { name: 'Reorder', href: '/inventory/reorder' }
        ]
    },
    {
        name: 'Billing',
        href: '/billing',
        icon: FileText,
        submenu: [
            { name: 'Create Invoice', href: '/billing/new' },
            { name: 'Invoice History', href: '/billing/history' },
            { name: 'Templates', href: '/billing/templates' }
        ]
    },
    {
        name: 'Customers',
        href: '/customers',
        icon: Users,
        submenu: [
            { name: 'All Customers', href: '/customers' },
            { name: 'Credit Tracking', href: '/customers/credit' }
        ]
    },
    {
        name: 'Reports',
        href: '/reports',
        icon: BarChart2,
        submenu: [
            { name: 'Sales Report', href: '/reports/sales' },
            { name: 'Inventory Report', href: '/reports/inventory' },
            { name: 'Tax Report', href: '/reports/tax' }
        ]
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        submenu: [
            { name: 'Business Info', href: '/settings/info' },
            { name: 'Users', href: '/settings/users' },
            { name: 'Integrations', href: '/settings/integrations' }
        ]
    }
];

export function Sidebar({ isOpenMobile, onCloseMobile }: { isOpenMobile?: boolean; onCloseMobile?: () => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const pathname = usePathname();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const toggleSubmenu = (name: string) => {
        if (isCollapsed && !isMobile) setIsCollapsed(false); // Auto-expand if clicking submenu
        setExpandedMenus(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    // Mobile Overlay Logic handled by parent or internal if requested, 
    // but usually Sidebar component just renders structure. 
    // The requirement says "Sidebar hidden by default on mobile... Hamburger in header opens it".
    // So likely this component is controlled by props for mobile visibility.

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-[280px]';
    const showMobile = isOpenMobile ? 'translate-x-0' : '-translate-x-full';

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpenMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={onCloseMobile}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 h-full z-50 bg-[#1F2937] text-gray-300 border-r border-gray-700/50
        transition-all duration-300 ease-in-out
        ${isMobile ? `${showMobile} w-[280px]` : sidebarWidth}
        ${isMobile ? 'pt-0' : 'pt-16'} // Account for fixed header on desktop
        flex flex-col shadow-2xl
      `}>
                {/* Mobile Header (Close Button) */}
                {isMobile && (
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                        <span className="text-xl font-bold text-white">Menu</span>
                        <button onClick={onCloseMobile} className="p-2 text-gray-400 hover:text-white">
                            <ChevronLeft size={24} />
                        </button>
                    </div>
                )}

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isMenuExpanded = expandedMenus.includes(item.name);
                        const active = isActive(item.href);

                        return (
                            <div key={item.name} className="px-3">
                                <div
                                    className={`
                    flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                    ${active ? 'bg-[#374151]' : 'hover:bg-[#374151]'}
                    ${active ? 'border-l-4 border-[#06B6D4] pl-2' : ''} 
                  `}
                                    onClick={() => item.submenu ? toggleSubmenu(item.name) : null}
                                >
                                    {/* Link wrapper if no submenu, otherwise div */}
                                    {item.submenu ? (
                                        <div className="flex items-center flex-1 min-w-0">
                                            <item.icon className={`
                        shrink-0 transition-colors duration-200
                        ${isCollapsed && !isMobile ? 'w-6 h-6 mx-auto' : 'w-6 h-6 mr-3'}
                        ${active ? 'text-[#BFFF00]' : 'text-gray-400 group-hover:text-gray-200'}
                      `} />
                                            {(!isCollapsed || isMobile) && (
                                                <span className={`text-sm font-medium truncate ${active ? 'text-[#06B6D4]' : 'text-gray-300'}`}>
                                                    {item.name}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href={item.href} className="flex items-center flex-1 min-w-0">
                                            <item.icon className={`
                        shrink-0 transition-colors duration-200
                        ${isCollapsed && !isMobile ? 'w-6 h-6 mx-auto' : 'w-6 h-6 mr-3'}
                        ${active ? 'text-[#BFFF00]' : 'text-gray-400 group-hover:text-gray-200'}
                      `} />
                                            {(!isCollapsed || isMobile) && (
                                                <span className={`text-sm font-medium truncate ${active ? 'text-[#06B6D4]' : 'text-gray-300'}`}>
                                                    {item.name}
                                                </span>
                                            )}
                                        </Link>
                                    )}

                                    {/* Submenu Toggle Icon */}
                                    {item.submenu && (!isCollapsed || isMobile) && (
                                        <div className="text-gray-500">
                                            {isMenuExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    )}
                                </div>

                                {/* Submenu Items */}
                                {item.submenu && isMenuExpanded && (!isCollapsed || isMobile) && (
                                    <div className="mt-1 ml-4 border-l border-gray-700 pl-2 space-y-1">
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                className={`
                          block px-3 py-2 rounded-lg text-xs font-medium transition-colors
                          ${pathname === sub.href ? 'text-[#06B6D4] bg-[#374151]/50' : 'text-gray-400 hover:text-gray-200 hover:bg-[#374151]/30'}
                        `}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer / Toggle Button */}
                {!isMobile && (
                    <div className="p-4 border-t border-gray-700/50">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#374151] transition-all"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
