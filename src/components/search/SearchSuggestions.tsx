'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, Package, User, FileText, TrendingUp } from 'lucide-react';
import { SearchSuggestion, SearchResultType } from '@/lib/types/search';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SearchSuggestionsProps {
    query: string;
    suggestions: SearchSuggestion[];
    recentSearches: string[];
    isLoading?: boolean;
    onSelect: (suggestion: SearchSuggestion) => void;
    onRecentSearchClick: (query: string) => void;
    onClose: () => void;
}

const TYPE_ICONS: Record<SearchResultType, any> = {
    product: Package,
    customer: User,
    invoice: FileText
};

const TYPE_LABELS: Record<SearchResultType, string> = {
    product: 'Products',
    customer: 'Customers',
    invoice: 'Invoices'
};

export function SearchSuggestions({
    query,
    suggestions,
    recentSearches,
    isLoading,
    onSelect,
    onRecentSearchClick,
    onClose
}: SearchSuggestionsProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);

    // Group suggestions by type
    const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
        if (!acc[suggestion.type]) {
            acc[suggestion.type] = [];
        }
        acc[suggestion.type].push(suggestion);
        return acc;
    }, {} as Record<SearchResultType, SearchSuggestion[]>);

    // Calculate total items for keyboard navigation
    const totalItems = recentSearches.length + suggestions.length;

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                // Handle selection
                if (selectedIndex < recentSearches.length) {
                    onRecentSearchClick(recentSearches[selectedIndex]);
                } else {
                    const suggestionIndex = selectedIndex - recentSearches.length;
                    onSelect(suggestions[suggestionIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, totalItems, recentSearches, suggestions, onSelect, onRecentSearchClick, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedIndex]);

    if (!query && recentSearches.length === 0) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-lg shadow-2xl p-4 z-50">
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                    <Search size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="font-medium">Start typing to search</p>
                    <p className="text-xs mt-1">Try searching by SKU or invoice number</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto custom-scrollbar"
        >
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
                <div className="border-b border-slate-100 dark:border-white/5">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Recent Searches
                    </div>
                    {recentSearches.map((search, idx) => (
                        <button
                            key={`recent-${idx}`}
                            ref={el => { itemRefs.current[idx] = el; }}
                            onClick={() => onRecentSearchClick(search)}
                            className={cn(
                                "w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors",
                                selectedIndex === idx
                                    ? "bg-teal-50 dark:bg-teal-500/10"
                                    : "hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{search}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    Searching...
                </div>
            )}

            {/* No Results */}
            {!isLoading && query && suggestions.length === 0 && (
                <div className="px-4 py-8 text-center">
                    <Search size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        No results found for "{query}"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Try different keywords or adjust filters
                    </p>
                </div>
            )}

            {/* Grouped Suggestions */}
            {!isLoading && query && Object.entries(groupedSuggestions).map(([type, items]) => {
                const TypeIcon = TYPE_ICONS[type as SearchResultType];
                const startIndex = recentSearches.length + suggestions.findIndex(s => s.type === type);

                return (
                    <div key={type} className="border-b border-slate-100 dark:border-white/5 last:border-0">
                        <div className="px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <TypeIcon size={12} />
                            {TYPE_LABELS[type as SearchResultType]}
                        </div>
                        {items.slice(0, 3).map((suggestion, localIdx) => {
                            const globalIdx = recentSearches.length + suggestions.indexOf(suggestion);
                            const Icon = TYPE_ICONS[suggestion.type];

                            return (
                                <Link
                                    key={suggestion.id}
                                    href={suggestion.result.url}
                                    ref={el => { itemRefs.current[globalIdx] = el; }}
                                    onClick={() => onSelect(suggestion)}
                                    className={cn(
                                        "block px-4 py-3 transition-colors",
                                        selectedIndex === globalIdx
                                            ? "bg-teal-50 dark:bg-teal-500/10"
                                            : "hover:bg-slate-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Icon or Image */}
                                        {suggestion.result.image ? (
                                            <img
                                                src={suggestion.result.image}
                                                alt={suggestion.result.title}
                                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-white/5"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                <Icon size={16} className="text-slate-400 dark:text-slate-500" />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                {suggestion.result.title}
                                            </div>
                                            {suggestion.result.subtitle && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {suggestion.result.subtitle}
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadata */}
                                        {suggestion.type === 'product' && (
                                            <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                                                ${suggestion.result.metadata?.price}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                );
            })}

            {/* See All Results */}
            {suggestions.length > 8 && (
                <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="block px-4 py-3 text-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                    See all {suggestions.length} results →
                </Link>
            )}
        </div>
    );
}
