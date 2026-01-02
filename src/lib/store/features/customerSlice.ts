import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    creditLimit: number;
    creditUsed: number;
    creditTerms: string;
    category: 'VIP' | 'Regular' | 'New';
    status: 'Active' | 'Inactive';
    dateAdded: string;
    notes?: string;
}

interface CustomerState {
    customers: Customer[];
    selectedCustomerId: string | null;
}

const generateMockCustomers = (count: number): Customer[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `CUST-${1000 + i}`,
        firstName: ['John', 'Jane', 'Robert', 'Alice', 'Michael'][i % 5],
        lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][i % 5],
        email: `customer${i}@example.com`,
        phone: `+1 555-01${i.toString().padStart(2, '0')}`,
        company: i % 3 === 0 ? `Company ${i}` : undefined,
        address: {
            street: `${100 + i} Main St`,
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
        },
        creditLimit: i % 2 === 0 ? 5000 : 2000,
        creditUsed: Math.floor(Math.random() * 1000),
        creditTerms: 'Net 30',
        category: i < 5 ? 'VIP' : 'Regular',
        status: 'Active',
        dateAdded: new Date(Date.now() - i * 86400000 * 10).toISOString(),
    }));
};

const initialState: CustomerState = {
    customers: [
        {
            id: 'CUST-DEMO',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 555-0123',
            company: 'Acme Corp',
            address: { street: '123 Market St', city: 'San Francisco', state: 'CA', zip: '94105', country: 'USA' },
            creditLimit: 10000,
            creditUsed: 2500,
            creditTerms: 'Net 30',
            category: 'VIP',
            status: 'Active',
            dateAdded: new Date().toISOString(),
        },
        ...generateMockCustomers(10)
    ],
    selectedCustomerId: null,
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        addCustomer: (state, action: PayloadAction<Customer>) => {
            state.customers.unshift(action.payload);
        },
        updateCustomer: (state, action: PayloadAction<Customer>) => {
            const index = state.customers.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
        },
        deleteCustomer: (state, action: PayloadAction<string>) => {
            state.customers = state.customers.filter(c => c.id !== action.payload);
        },
        setSelectedCustomer: (state, action: PayloadAction<string | null>) => {
            state.selectedCustomerId = action.payload;
        },
        updateCreditUsage: (state, action: PayloadAction<{ id: string; amount: number; type: 'increase' | 'decrease' }>) => {
            const customer = state.customers.find(c => c.id === action.payload.id);
            if (customer) {
                if (action.payload.type === 'increase') {
                    customer.creditUsed += action.payload.amount;
                } else {
                    customer.creditUsed = Math.max(0, customer.creditUsed - action.payload.amount);
                }
            }
        }
    }
});

export const {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setSelectedCustomer,
    updateCreditUsage
} = customerSlice.actions;

export default customerSlice.reducer;
