'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/lib/hooks/useSearch';
import { SmartSuggestions } from '@/components/search/SmartSuggestions';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, Package, User, FileText, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
    product: Package,
    customer: User,
    invoice: FileText
};

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const {
        query,
        results,
        smartSuggestions,
        isLoading,
        totalResults,
        sortBy,
        setSortBy,
        search
    } = useSearch();

    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
        if (initialQuery) {
            search(initialQuery);
        }
    }, [initialQuery]);

    if (!mounted) {
        return <div className="min-h-screen bg-light-base dark:bg-dark-base" />;
    }

    return (
        <div className="min-h-screen bg-light-base dark:bg-dark-base py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Smart Suggestions */}
                {smartSuggestions.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-slate-400 mb-4">Smart Suggestions</h2>
                        <SmartSuggestions suggestions={smartSuggestions} />
                    </div>
                )}

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        {query ? (
                            <>
                                <h1 className="text-2xl font-bold text-white mb-1">
                                    Search Results
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Found {totalResults} results for "{query}"
                                </p>
                            </>
                        ) : (
                            <h1 className="text-2xl font-bold text-white">
                                Enter a search query to begin
                            </h1>
                        )}
                    </div>

                    {results.length > 0 && (
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="recent">Recent</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 mt-4">Searching...</p>
                    </div>
                )}

                {/* No Results */}
                {!isLoading && query && results.length === 0 && (
                    <GlassCard className="p-12 text-center">
                        <Search size={48} className="mx-auto mb-4 text-slate-400" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                            No results found for "{query}"
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Try different keywords or adjust your filters
                        </p>
                        <Link
                            href="/inventory"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors"
                        >
                            Browse All Products
                        </Link>
                    </GlassCard>
                )}

                {/* Results Grid */}
                {!isLoading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((result) => {
                            const Icon = TYPE_ICONS[result.type];

                            return (
                                <Link key={result.id} href={result.url}>
                                    <GlassCard className="p-4 hover:border-teal-500/50 transition-all duration-200 hover:scale-105">
                                        <div className="flex items-start gap-3">
                                            {result.image ? (
                                                <img
                                                    src={result.image}
                                                    alt={result.title}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <Icon size={24} className="text-slate-400" />
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className="font-semibold text-white truncate">
                                                        {result.title}
                                                    </h3>
                                                    <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 capitalize">
                                                        {result.type}
                                                    </span>
                                                </div>

                                                {result.subtitle && (
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {result.subtitle}
                                                    </p>
                                                )}

                                                {result.metadata && (
                                                    <div className="mt-2 text-xs text-slate-500">
                                                        {result.type === 'product' && (
                                                            <div className="flex items-center justify-between">
                                                                <span>SKU: {result.metadata.sku}</span>
                                                                <span className="font-bold text-teal-400">
                                                                    ${result.metadata.price}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {result.type === 'invoice' && (
                                                            <div className="flex items-center justify-between">
                                                                <span>{result.metadata.invoiceNumber}</span>
                                                                <span className="font-bold text-teal-400">
                                                                    ${result.metadata.amount}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {result.type === 'customer' && (
                                                            <span>{result.metadata.email}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-light-base dark:bg-dark-base" />}>
            <SearchResultsContent />
        </Suspense>
    );
}
