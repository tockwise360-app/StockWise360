import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StockMovement {
    id: string;
    type: 'Stock In' | 'Stock Out' | 'Adjustment';
    amount: number;
    reason: string;
    notes?: string;
    date: string;
    status: 'pos' | 'neg';
}

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    location: string[];
    stockLevel: number;
    minStock: number;
    maxStock: number;
    reorderPoint: number;
    unitPrice: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';
    lastUpdated: string;
    turnoverRate: 'High' | 'Medium' | 'Low';
    supplier: string;
    costPrice: number;
    leadTime: number;
    unit: string;
    history: StockMovement[];
    autoReorder: boolean;
    minOrderQuantity: number;
}

export interface Alert {
    id: string;
    type: 'low-stock' | 'reorder' | 'info';
    message: string;
    itemId: string;
    date: string;
    isRead: boolean;
}

interface InventoryState {
    items: InventoryItem[];
    alerts: Alert[];
    filters: {
        search: string;
        category: string[];
        location: string[];
        status: string[];
        priceRange: { min: number; max: number };
        dateRange: { start: string | null; end: string | null };
        supplier: string[];
        reorderOnly: boolean;
    };
    sort: {
        key: keyof InventoryItem;
        direction: 'asc' | 'desc';
    };
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    rowSelection: Record<string, boolean>;
    selectedItemId: string | null;
    isDetailOpen: boolean;
    isAddProductOpen: boolean;
    isAdjustmentModalOpen: boolean;
    lastAdjustment: {
        id: string;
        itemId: string;
        previousStock: number;
        newStock: number;
        timestamp: number;
    } | null;
}

// Helper to generate mock data
const generateMockData = (count: number): InventoryItem[] => {
    const categories = ['Electronics', 'Furniture', 'Home', 'Groceries', 'Accessories'];
    const locations = ['Warehouse A', 'Warehouse B', 'Store Front', 'Backroom'];
    const turnovers = ['High', 'Medium', 'Low'] as const;
    const suppliers = ['Global Tech', 'Furniture Mart', 'Eco Goods', 'Hardware Hub', 'Apex Supplies'];
    const units = ['pcs', 'kg', 'm', 'sets', 'liters'];

    return Array.from({ length: count }, (_, i) => {
        const categoryIndex = i % categories.length;
        const locationIndex = i % locations.length;
        const suffixIndex = i % 5;
        const turnoverIndex = i % turnovers.length;
        const supplierIndex = i % suppliers.length;
        const unitIndex = i % units.length;

        const category = categories[categoryIndex];
        const stock = (i * 17) % 200;
        const min = ((i * 3) % 15) + 5;
        const status = stock === 0 ? 'Out of Stock' : stock < min ? 'Low Stock' : stock > 150 ? 'Overstock' : 'In Stock';

        const suffixes = ['Pro', 'Max', 'Lite', 'Standard', 'Ultra'];
        const unitPrice = ((i * 7) % 500) + 10;

        return {
            id: `INV-${1000 + i}`,
            name: `${category} Item ${i + 1} - ${suffixes[suffixIndex]}`,
            sku: `${category.substring(0, 3).toUpperCase()}-${1000 + i}`,
            category,
            location: [locations[locationIndex]],
            stockLevel: stock,
            minStock: min,
            maxStock: min * 5,
            reorderPoint: min + 10,
            unitPrice: unitPrice,
            status,
            turnoverRate: turnovers[turnoverIndex],
            lastUpdated: new Date('2024-01-01T12:00:00Z').toISOString(),
            supplier: suppliers[supplierIndex],
            costPrice: unitPrice * 0.7,
            leadTime: (i % 14) + 1,
            unit: units[unitIndex],
            history: Array.from({ length: 5 }, (_, j) => ({
                id: `HIST-${i}-${j}`,
                type: j % 2 === 0 ? 'Stock In' : 'Stock Out',
                amount: Math.floor(Math.random() * 50) + 1,
                reason: j % 2 === 0 ? 'Restock' : 'Order Fulfillment',
                date: new Date(Date.now() - j * 86400000 * 3).toISOString(),
                status: j % 2 === 0 ? 'pos' : 'neg'
            })),
            autoReorder: i % 4 !== 0,
            minOrderQuantity: 25,
        };
    });
};

const MOCK_INVENTORY: InventoryItem[] = generateMockData(200);

const initialState: InventoryState = {
    items: MOCK_INVENTORY,
    alerts: [],
    filters: {
        search: '',
        category: [],
        location: [],
        status: [],
        priceRange: { min: 0, max: 10000 },
        dateRange: { start: null, end: null },
        supplier: [],
        reorderOnly: false,
    },
    sort: {
        key: 'name',
        direction: 'asc',
    },
    pagination: {
        pageIndex: 0,
        pageSize: 10,
    },
    rowSelection: {},
    selectedItemId: null,
    isDetailOpen: false,
    isAddProductOpen: false,
    isAdjustmentModalOpen: false,
    lastAdjustment: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        ...initialState,
        isAdjustmentModalOpen: false,
        lastAdjustment: null,
        isAddProductOpen: false,
    } as InventoryState,
    reducers: {
        openAddProductModal: (state) => {
            state.isAddProductOpen = true;
        },
        closeAddProductModal: (state) => {
            state.isAddProductOpen = false;
        },
        addItem: (state, action: PayloadAction<InventoryItem>) => {
            state.items.unshift(action.payload);
            state.isAddProductOpen = false;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
            state.pagination.pageIndex = 0; // Reset page on filter change
        },
        setCategoryFilter: (state, action: PayloadAction<string[]>) => {
            state.filters.category = action.payload;
            state.pagination.pageIndex = 0;
        },
        setStatusFilter: (state, action: PayloadAction<string[]>) => {
            state.filters.status = action.payload;
            state.pagination.pageIndex = 0;
        },
        setPriceRangeFilter: (state, action: PayloadAction<{ min: number; max: number }>) => {
            state.filters.priceRange = action.payload;
            state.pagination.pageIndex = 0;
        },
        setDateRangeFilter: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
            state.filters.dateRange = action.payload;
            state.pagination.pageIndex = 0;
        },
        setSupplierFilter: (state, action: PayloadAction<string[]>) => {
            state.filters.supplier = action.payload;
            state.pagination.pageIndex = 0;
        },
        setReorderOnly: (state, action: PayloadAction<boolean>) => {
            state.filters.reorderOnly = action.payload;
            state.pagination.pageIndex = 0;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.pageIndex = 0;
        },
        setSort: (state, action: PayloadAction<{ key: keyof InventoryItem; direction: 'asc' | 'desc' }>) => {
            state.sort = action.payload;
        },
        setPagination: (state, action: PayloadAction<{ pageIndex: number; pageSize: number }>) => {
            state.pagination = action.payload;
        },
        setRowSelection: (state, action: PayloadAction<Record<string, boolean>>) => {
            state.rowSelection = action.payload;
        },
        resetSelection: (state) => {
            state.rowSelection = {};
        },
        selectItem: (state, action: PayloadAction<string | null>) => {
            state.selectedItemId = action.payload;
            state.isDetailOpen = !!action.payload;
        },
        closeDetail: (state) => {
            state.isDetailOpen = false;
            state.selectedItemId = null;
        },
        openAdjustmentModal: (state) => {
            state.isAdjustmentModalOpen = true;
        },
        closeAdjustmentModal: (state) => {
            state.isAdjustmentModalOpen = false;
        },
        adjustStock: (state, action: PayloadAction<{ id: string; amount: number; type: 'add' | 'remove' | 'set'; reason: string; notes?: string }>) => {
            const { id, amount, type, reason, notes } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                const previousStock = item.stockLevel;

                if (type === 'add') item.stockLevel += amount;
                else if (type === 'remove') item.stockLevel = Math.max(0, item.stockLevel - amount);
                else item.stockLevel = amount;

                const variance = item.stockLevel - previousStock;

                // Save for undo
                state.lastAdjustment = {
                    id: Math.random().toString(36).substring(7),
                    itemId: item.id,
                    previousStock,
                    newStock: item.stockLevel,
                    timestamp: Date.now(),
                };

                // Record History
                if (variance !== 0) {
                    item.history.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        type: type === 'add' ? 'Stock In' : type === 'remove' ? 'Stock Out' : 'Adjustment',
                        amount: Math.abs(variance),
                        reason: reason || 'Manual Adjustment',
                        notes,
                        date: new Date().toISOString(),
                        status: variance > 0 ? 'pos' : 'neg'
                    });
                }

                // Recalculate status
                if (item.stockLevel === 0) item.status = 'Out of Stock';
                else if (item.stockLevel <= item.minStock) item.status = 'Low Stock';
                else if (item.stockLevel >= item.maxStock) item.status = 'Overstock';
                else item.status = 'In Stock';

                item.lastUpdated = new Date().toISOString();
            }
        },
        undoLastAdjustment: (state) => {
            if (state.lastAdjustment) {
                const item = state.items.find(i => i.id === state.lastAdjustment!.itemId);
                if (item) {
                    item.stockLevel = state.lastAdjustment.previousStock;

                    // Recalculate status
                    if (item.stockLevel === 0) item.status = 'Out of Stock';
                    else if (item.stockLevel <= item.minStock) item.status = 'Low Stock';
                    else if (item.stockLevel >= item.maxStock) item.status = 'Overstock';
                    else item.status = 'In Stock';

                    item.lastUpdated = new Date().toISOString();
                }
                state.lastAdjustment = null;
            }
        },
        updateReorderSettings: (state, action: PayloadAction<{ id: string; reorderPoint: number; autoReorder: boolean; minOrderQuantity: number }>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.reorderPoint = action.payload.reorderPoint;
                item.autoReorder = action.payload.autoReorder;
                item.minOrderQuantity = action.payload.minOrderQuantity;
                item.lastUpdated = new Date().toISOString();
            }
        },
        generateAlerts: (state) => {
            const lowStockItems = state.items.filter(i => i.stockLevel <= i.minStock && i.status !== 'Out of Stock');
            // const outOfStockItems = state.items.filter(i => i.stockLevel === 0); // Can add out of stock alerts too

            const newAlerts: Alert[] = [];

            lowStockItems.forEach(item => {
                // Prevent duplicate alerts for same item today/session
                const exists = state.alerts.find(a => a.itemId === item.id && a.type === 'low-stock');
                if (!exists) {
                    newAlerts.push({
                        id: `ALERT-${Math.random().toString(36).substr(2, 9)}`,
                        type: 'low-stock',
                        message: `Low Stock: ${item.name} (${item.stockLevel} left)`,
                        itemId: item.id,
                        date: new Date().toISOString(),
                        isRead: false
                    });
                }
            });

            state.alerts = [...newAlerts, ...state.alerts];
        },
        markAlertAsRead: (state, action: PayloadAction<string>) => {
            const alert = state.alerts.find(a => a.id === action.payload);
            if (alert) alert.isRead = true;
        },
        clearAlerts: (state) => {
            state.alerts = [];
        },
        deleteItems: (state, action: PayloadAction<string[]>) => {
            const idsToRemove = new Set(action.payload);
            state.items = state.items.filter(item => !idsToRemove.has(item.id));
            // Clear selection for deleted items
            action.payload.forEach(id => {
                delete state.rowSelection[id];
            });
        },
    },
});

export const {
    setSearch,
    setCategoryFilter,
    setStatusFilter,
    setPriceRangeFilter,
    setDateRangeFilter,
    setSupplierFilter,
    resetFilters,
    setSort,
    selectItem,
    closeDetail,
    adjustStock,
    undoLastAdjustment,
    openAdjustmentModal,
    closeAdjustmentModal,
    openAddProductModal,
    closeAddProductModal,
    addItem,
    updateReorderSettings,
    setReorderOnly,
    setPagination,
    setRowSelection,
    resetSelection,
    deleteItems,
    generateAlerts,
    markAlertAsRead,
    clearAlerts
} = inventorySlice.actions;
export default inventorySlice.reducer;
