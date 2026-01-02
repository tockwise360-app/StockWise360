import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export type InvoiceTemplate = 'Basic' | 'Professional' | 'Modern' | 'Minimal' | 'Creative' | 'Tax Invoice' | 'Service Invoice';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail?: string;
    customerAddress?: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    tax: number;
    total: number;
    status: 'Draft' | 'Paid' | 'Pending';
    notes: string;
    template: InvoiceTemplate;
}

interface InvoiceState {
    currentInvoice: Invoice;
    invoices: Invoice[];
}

const generateInvoiceNumber = () => `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

const initialCurrentInvoice: Invoice = {
    id: '',
    invoiceNumber: generateInvoiceNumber(),
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    taxRate: 18,
    tax: 0,
    total: 0,
    status: 'Draft',
    notes: '',
    template: 'Professional'
};

const initialState: InvoiceState = {
    currentInvoice: initialCurrentInvoice,
    invoices: []
};

const calculateTotals = (invoice: Invoice) => {
    invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    invoice.tax = invoice.subtotal * (invoice.taxRate / 100);
    invoice.total = invoice.subtotal + invoice.tax;
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<string>) => {
            state.currentInvoice.customerName = action.payload;
        },
        updateInvoiceMetadata: (state, action: PayloadAction<Partial<Invoice>>) => {
            state.currentInvoice = { ...state.currentInvoice, ...action.payload };
            calculateTotals(state.currentInvoice);
        },
        addItemToInvoice: (state, action: PayloadAction<InvoiceItem>) => {
            state.currentInvoice.items.push(action.payload);
            calculateTotals(state.currentInvoice);
        },
        updateInvoiceItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.currentInvoice.items.find(i => i.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                item.total = item.unitPrice * item.quantity;
                calculateTotals(state.currentInvoice);
            }
        },
        removeInvoiceItem: (state, action: PayloadAction<string>) => {
            const idx = state.currentInvoice.items.findIndex(i => i.id === action.payload);
            if (idx !== -1) {
                state.currentInvoice.items.splice(idx, 1);
                calculateTotals(state.currentInvoice);
            }
        },
        saveInvoice: (state) => {
            const newInvoice = {
                ...state.currentInvoice,
                id: state.currentInvoice.invoiceNumber, // Use invoice number as ID for now
                status: 'Paid' as const
            };
            state.invoices.unshift(newInvoice);
            state.currentInvoice = {
                ...initialCurrentInvoice,
                invoiceNumber: generateInvoiceNumber()
            };
        },
        resetCurrentInvoice: (state) => {
            state.currentInvoice = {
                ...initialCurrentInvoice,
                invoiceNumber: generateInvoiceNumber()
            };
        }
    }
});

export const {
    setCustomer,
    updateInvoiceMetadata,
    addItemToInvoice,
    updateInvoiceItem,
    removeInvoiceItem,
    saveInvoice,
    resetCurrentInvoice
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
