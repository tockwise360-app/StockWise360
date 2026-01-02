'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchCache } from './useSearchCache';
import {
    SearchResult,
    SearchFilters,
    SearchSuggestion,
    SmartSuggestion,
    SearchSortOption,
    ProductSearchResult,
    CustomerSearchResult,
    InvoiceSearchResult
} from '@/lib/types/search';

const DEBOUNCE_MS = 300;

// Mock data for demonstration
const MOCK_PRODUCTS: ProductSearchResult[] = [
    {
        id: 'p1',
        type: 'product',
        title: 'Samsung Galaxy S23',
        subtitle: 'Electronics',
        image: '/products/samsung-s23.jpg',
        url: '/inventory/p1',
        metadata: { sku: 'SAM-S23-BLK', price: 799.99, stock: 45, category: 'Electronics' }
    },
    {
        id: 'p2',
        type: 'product',
        title: 'Sony WH-1000XM5 Headphones',
        subtitle: 'Audio',
        image: '/products/sony-headphones.jpg',
        url: '/inventory/p2',
        metadata: { sku: 'SONY-XM5-BLK', price: 399.99, stock: 12, category: 'Electronics' }
    }
];

const MOCK_CUSTOMERS: CustomerSearchResult[] = [
    {
        id: 'c1',
        type: 'customer',
        title: 'Acme Corporation',
        subtitle: 'Premium Customer',
        url: '/customers/c1',
        metadata: { email: 'contact@acme.com', phone: '+1-555-0100', totalOrders: 45, totalSpent: 125000 }
    }
];

const MOCK_INVOICES: InvoiceSearchResult[] = [
    {
        id: 'i1',
        type: 'invoice',
        title: 'Invoice INV-2024-001',
        subtitle: 'Acme Corporation',
        url: '/invoices/i1',
        metadata: { invoiceNumber: 'INV-2024-001', amount: 5499.99, date: '2024-01-15', status: 'paid', customerName: 'Acme Corporation' }
    }
];

const MOCK_SMART_SUGGESTIONS: SmartSuggestion[] = [
    {
        id: 's1',
        title: 'Low Stock Alerts',
        description: '12 products running low',
        icon: 'AlertTriangle',
        url: '/inventory?filter=low-stock',
        count: 12,
        priority: 'high'
    },
    {
        id: 's2',
        title: 'Overdue Invoices',
        description: '5 invoices past due',
        icon: 'Clock',
        url: '/invoices?filter=overdue',
        count: 5,
        priority: 'high'
    },
    {
        id: 's3',
        title: 'Top Customers',
        description: 'View your best customers',
        icon: 'Star',
        url: '/customers?sort=revenue',
        priority: 'medium'
    }
];

export function useSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [smartSuggestions] = useState<SmartSuggestion[]>(MOCK_SMART_SUGGESTIONS);
    const [filters, setFilters] = useState<SearchFilters>({
        types: ['product', 'customer', 'invoice'],
        categories: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');

    const { getCached, setCached } = useSearchCache<SearchResult[]>();
    const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Mock search function
    const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters): Promise<SearchResult[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 150));

        const allResults: SearchResult[] = [
            ...MOCK_PRODUCTS,
            ...MOCK_CUSTOMERS,
            ...MOCK_INVOICES
        ];

        if (!searchQuery.trim()) {
            return [];
        }

        const lowercaseQuery = searchQuery.toLowerCase();

        return allResults.filter((result) => {
            // Filter by type
            if (!searchFilters.types.includes(result.type)) {
                return false;
            }

            // Search in title and subtitle
            const matchesQuery =
                result.title.toLowerCase().includes(lowercaseQuery) ||
                result.subtitle?.toLowerCase().includes(lowercaseQuery) ||
                (result.type === 'product' && (result as ProductSearchResult).metadata.sku.toLowerCase().includes(lowercaseQuery)) ||
                (result.type === 'invoice' && (result as InvoiceSearchResult).metadata.invoiceNumber.toLowerCase().includes(lowercaseQuery));

            return matchesQuery;
        });
    }, []);

    // Debounced search
    const search = useCallback((searchQuery: string) => {
        setQuery(searchQuery);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!searchQuery.trim()) {
            setResults([]);
            setSuggestions([]);
            setTotalResults(0);
            return;
        }

        setIsLoading(true);

        debounceTimerRef.current = setTimeout(async () => {
            const cacheKey = `${searchQuery}:${JSON.stringify(filters)}`;

            // Check cache first
            const cached = getCached(cacheKey);
            if (cached) {
                setResults(cached);
                setTotalResults(cached.length);
                setSuggestions(cached.slice(0, 10).map((r, idx) => ({
                    id: `${r.id}-suggestion-${idx}`,
                    type: r.type,
                    text: r.title,
                    result: r
                })));
                setIsLoading(false);
                return;
            }

            // Perform search
            const searchResults = await performSearch(searchQuery, filters);

            setCached(cacheKey, searchResults);
            setResults(searchResults);
            setTotalResults(searchResults.length);
            setSuggestions(searchResults.slice(0, 10).map((r, idx) => ({
                id: `${r.id}-suggestion-${idx}`,
                type: r.type,
                text: r.title,
                result: r
            })));
            setIsLoading(false);
        }, DEBOUNCE_MS);
    }, [filters, getCached, setCached, performSearch]);

    const applyFilters = useCallback((newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        // Re-trigger search with new filters
        if (query) {
            search(query);
        }
    }, [query, search]);

    const clearFilters = useCallback(() => {
        setFilters({
            types: ['product', 'customer', 'invoice'],
            categories: [],
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        query,
        results,
        suggestions,
        smartSuggestions,
        filters,
        isLoading,
        totalResults,
        sortBy,
        search,
        applyFilters,
        clearFilters,
        setSortBy,
    };
}
