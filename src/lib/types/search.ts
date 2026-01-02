// Search Result Types
export type SearchResultType = 'product' | 'customer' | 'invoice';

export interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    metadata?: Record<string, any>;
    url: string;
}

export interface ProductSearchResult extends SearchResult {
    type: 'product';
    metadata: {
        sku: string;
        price: number;
        stock: number;
        category: string;
    };
}

export interface CustomerSearchResult extends SearchResult {
    type: 'customer';
    metadata: {
        email: string;
        phone: string;
        totalOrders: number;
        totalSpent: number;
    };
}

export interface InvoiceSearchResult extends SearchResult {
    type: 'invoice';
    metadata: {
        invoiceNumber: string;
        amount: number;
        date: string;
        status: 'paid' | 'pending' | 'overdue';
        customerName: string;
    };
}

// Search Filters
export interface SearchFilters {
    types: SearchResultType[];
    categories: string[];
    dateRange?: {
        from: Date;
        to: Date;
    };
    priceRange?: {
        min: number;
        max: number;
    };
    stockStatus?: ('in-stock' | 'low-stock' | 'out-of-stock')[];
}

// Search Suggestions
export interface SearchSuggestion {
    id: string;
    type: SearchResultType;
    text: string;
    result: SearchResult;
}

// Smart Suggestions (AI)
export interface SmartSuggestion {
    id: string;
    title: string;
    description: string;
    icon: string;
    url: string;
    count?: number;
    priority: 'high' | 'medium' | 'low';
}

// Search State
export interface SearchState {
    query: string;
    results: SearchResult[];
    suggestions: SearchSuggestion[];
    smartSuggestions: SmartSuggestion[];
    filters: SearchFilters;
    isLoading: boolean;
    error: string | null;
    totalResults: number;
    page: number;
    pageSize: number;
}

// Sort Options
export type SearchSortOption = 'relevance' | 'recent' | 'alphabetical' | 'price-asc' | 'price-desc';

// Cache Entry
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}
