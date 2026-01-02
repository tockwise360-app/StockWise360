'use client';

import { useCallback, useRef } from 'react';
import { CacheEntry } from '@/lib/types/search';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useSearchCache<T = any>() {
    const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());

    const getCached = useCallback((key: string): T | null => {
        const entry = cacheRef.current.get(key);

        if (!entry) return null;

        // Check if cache has expired
        if (Date.now() > entry.expiresAt) {
            cacheRef.current.delete(key);
            return null;
        }

        return entry.data;
    }, []);

    const setCached = useCallback((key: string, data: T) => {
        const now = Date.now();
        const entry: CacheEntry<T> = {
            data,
            timestamp: now,
            expiresAt: now + CACHE_DURATION,
        };

        cacheRef.current.set(key, entry);
    }, []);

    const clearCache = useCallback(() => {
        cacheRef.current.clear();
    }, []);

    const clearExpired = useCallback(() => {
        const now = Date.now();
        const keysToDelete: string[] = [];

        cacheRef.current.forEach((entry, key) => {
            if (now > entry.expiresAt) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach((key) => cacheRef.current.delete(key));
    }, []);

    return {
        getCached,
        setCached,
        clearCache,
        clearExpired,
    };
}
