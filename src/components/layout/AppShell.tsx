'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, CreditCard, PieChart, Menu, X, User } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { AlertDrawer } from '@/components/layout/AlertDrawer';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { FilterPanel } from '@/components/search/FilterPanel';
import { useSearch } from '@/lib/hooks/useSearch';
import { useSearchHistory } from '@/lib/hooks/useSearchHistory';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/context/ThemeContext';
import { useAppDispatch } from '@/lib/store/hooks';
import { generateAlerts } from '@/lib/store/features/inventorySlice';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Initial check for low stock alerts
    React.useEffect(() => {
        dispatch(generateAlerts());
    }, [dispatch]);

    const {
        query,
        suggestions,
        smartSuggestions,
        filters,
        search,
        applyFilters
    } = useSearch();

    const { history, addToHistory } = useSearchHistory();

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Inventory', href: '/inventory', icon: Package },
        { label: 'Billing', href: '/invoices', icon: CreditCard },
        { label: 'Reports', href: '/reports', icon: PieChart },
    ];

    const handleSearchChange = (value: string) => {
        search(value);
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestion: any) => {
        addToHistory(query);
        setShowSuggestions(false);
        router.push(suggestion.result.url);
    };

    const handleRecentSearchClick = (searchQuery: string) => {
        search(searchQuery);
    };

    const activeFiltersCount =
        (filters.types.length < 3 ? 1 : 0) +
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.priceRange ? 1 : 0) +
        (filters.stockStatus && filters.stockStatus.length > 0 ? 1 : 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-300 flex flex-col">
            {/* Top Navigation Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 z-50 transition-colors duration-300">
                <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">

                    {/* Logo & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                S
                            </div>
                            <span className="hidden lg:inline font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                                StockWise<span className="text-teal-500">360</span>
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:block relative flex-1 max-w-2xl">
                        <SearchBar
                            value={query}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onFilterClick={() => setIsFilterPanelOpen(true)}
                            activeFiltersCount={activeFiltersCount}
                        />

                        {showSuggestions && (
                            <SearchSuggestions
                                query={query}
                                suggestions={suggestions}
                                recentSearches={history.map(h => h.query)}
                                onSelect={handleSuggestionSelect}
                                onRecentSearchClick={handleRecentSearchClick}
                                onClose={() => setShowSuggestions(false)}
                            />
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                                        isActive
                                            ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                                    )}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions: Theme Toggle & Profile */}
                    <div className="flex items-center gap-3">
                        <NotificationBell onClick={() => setIsAlertDrawerOpen(true)} />

                        <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

                        <ThemeToggle />

                        <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

                        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-teal-500/20 group-hover:text-teal-500 transition-colors">
                                <User size={16} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Global Components */}
            <AlertDrawer
                isOpen={isAlertDrawerOpen}
                onClose={() => setIsAlertDrawerOpen(false)}
            />

            {/* Filter Panel */}
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                filters={filters}
                onApplyFilters={applyFilters}
            />

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-white dark:bg-[#020617] md:hidden overflow-y-auto animate-in slide-in-from-top-5 duration-200">
                    <div className="p-4 flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "p-4 rounded-xl text-base font-medium transition-all duration-200 flex items-center gap-3",
                                        isActive
                                            ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 pt-16 relative">
                {children}
            </main>
        </div>
    );
}
