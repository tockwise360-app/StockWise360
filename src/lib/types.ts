export type BusinessType =
    | 'Mobile Shop'
    | 'Hardware - Electronics'
    | 'Hardware - Plumbing'
    | 'Pharmacy'
    | 'Bike Accessories'
    | 'Car Accessories'
    | 'Car Repair'
    | 'Bike Repair'
    | 'Grocery'
    | 'Supermarket';

export interface Product {
    id: string;
    name: string;
    category: string;
    stock: number;
    price: number;
    cost: number;
    expiryDate?: string; // ISO date string
    manufacturingDate?: string;
    gstRate: number; // Percentage
    businessType: BusinessType;
    attributes?: Record<string, string | number>;
    lowStockThreshold?: number;
}

export interface InvoiceItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    gstRate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    customerName: string;
    customerPhone?: string;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
    total: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
}

export interface InventoryState {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProductsByType: (type: BusinessType) => Product[];
}
