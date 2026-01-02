import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboardSlice';
import inventoryReducer from './features/inventorySlice';
import invoiceReducer from './features/invoiceSlice';
import customerReducer from './features/customerSlice';

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        inventory: inventoryReducer,
        invoice: invoiceReducer,
        customer: customerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
