'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'stockwise_search_history';
const MAX_HISTORY_ITEMS = 5;

export interface SearchHistoryItem {
    query: string;
    timestamp: number;
}

export function useSearchHistory() {
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setHistory(parsed);
            }
        } catch (error) {
            console.error('Failed to load search history:', error);
        }
    }, []);

    // Save to localStorage whenever history changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Failed to save search history:', error);
        }
    }, [history]);

    const addToHistory = (query: string) => {
        if (!query.trim()) return;

        setHistory((prev) => {
            // Remove duplicate if exists
            const filtered = prev.filter((item) => item.query !== query);

            // Add new item at the beginning
            const newHistory = [
                { query, timestamp: Date.now() },
                ...filtered
            ].slice(0, MAX_HISTORY_ITEMS); // Keep only MAX_HISTORY_ITEMS

            return newHistory;
        });
    };

    const removeFromHistory = (query: string) => {
        setHistory((prev) => prev.filter((item) => item.query !== query));
    };

    const clearHistory = () => {
        setHistory([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear search history:', error);
        }
    };

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
    };
}
