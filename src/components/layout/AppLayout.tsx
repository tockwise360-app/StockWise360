'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { FilterPanel } from '@/components/search/FilterPanel';
import { useSearch } from '@/lib/hooks/useSearch';
import { useSearchHistory } from '@/lib/hooks/useSearchHistory';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const {
        query,
        suggestions,
        filters,
        search,
        applyFilters
    } = useSearch();

    const { history, addToHistory } = useSearchHistory();

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) {
        return <div className="min-h-screen bg-light-base dark:bg-dark-base" />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-light-base dark:bg-dark-base">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    <aside className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden animate-slide-in-left">
                        <Sidebar />
                    </aside>
                </>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex-shrink-0 h-16 bg-white/80 dark:bg-dark-elevated/80 backdrop-blur-xl border-b border-slate-200 dark:border-dark-border">
                    <div className="h-full px-4 flex items-center justify-between gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

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

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />

                            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                            <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative">
                                <Bell size={18} className="text-slate-600 dark:text-slate-400" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-teal-500/20 hover:text-teal-500 transition-colors">
                                <User size={16} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            {/* Filter Panel */}
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                filters={filters}
                onApplyFilters={applyFilters}
            />
        </div>
    );
}
