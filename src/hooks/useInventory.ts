'use client';

import { useState, useEffect } from 'react';
import { Product, BusinessType } from '@/lib/types';
import { SEED_DATA } from '@/lib/seedData';

const STORAGE_KEY = 'stockwise_inventory';

export function useInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setProducts(JSON.parse(stored));
        } else {
            // Initialize with seed data if empty
            setProducts(SEED_DATA);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
        }
        setIsLoaded(true);
    }, []);

    const saveProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    };

    const addProduct = (product: Product) => {
        saveProducts([...products, product]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        const newProducts = products.map(p =>
            p.id === id ? { ...p, ...updates } : p
        );
        saveProducts(newProducts);
    };

    const deleteProduct = (id: string) => {
        const newProducts = products.filter(p => p.id !== id);
        saveProducts(newProducts);
    };

    const getProductsByType = (type: BusinessType) => {
        return products.filter(p => p.businessType === type);
    };

    return {
        products,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByType
    };
}
