'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    FileText,
    Settings,
    Menu,
    X,
    Bot,
    Store
} from 'lucide-react';
import styles from './Layout.module.css';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: any) => {
    return (
        <Link href={href} className={clsx(styles.sidebarItem, active && styles.active)}>
            <Icon size={20} />
            {!collapsed && <span className={styles.label}>{label}</span>}
            {active && <motion.div layoutId="activeTab" className={styles.activeIndicator} />}
        </Link>
    );
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: Package, label: 'Inventory', href: '/inventory' },
        { icon: FileText, label: 'Invoices', href: '/invoices' },
        { icon: Bot, label: 'AI Assistant', href: '/ai-assistant' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className={styles.layout}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <div className={styles.logo}>
                    <Store className={styles.logoIcon} />
                    <span>StockWise360</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={clsx(styles.sidebar, isMobileMenuOpen && styles.open)}>
                <div className={styles.sidebarHeader}>
                    <Store className={styles.logoIcon} size={28} />
                    <span className={styles.logoText}>StockWise360</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            active={pathname === item.href}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.contentContainer}>
                    {children}
                </div>
            </main>
        </div>
    );
}
