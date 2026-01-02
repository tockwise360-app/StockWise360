import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types (Interfaces)
export interface DashboardState {
    selectedDateRange: { startDate: string; endDate: string };
    businessHealthScore: number;
    salesData: any[]; // Replace with specific type
    inventoryMetrics: any; // Replace with specific type
    recommendations: any[]; // Replace with specific type
    isLoading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    selectedDateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        endDate: new Date().toISOString(),
    },
    businessHealthScore: 0,
    salesData: [],
    inventoryMetrics: {},
    recommendations: [],
    isLoading: false,
    error: null,
};

// Mock Async Thunks for data fetching (Replace with actual API calls later)
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return mock data for now
        return {
            businessHealthScore: 78,
            salesData: [],
            inventoryMetrics: {
                totalSkus: 1250,
                lowStock: 15,
                deadStock: 8,
            },
            recommendations: [
                { id: 1, type: 'critical', message: 'Reorder 25 units of Product X' },
                { id: 2, type: 'warning', message: 'Inventory efficiency down 12%' },
            ],
        };
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
            state.selectedDateRange = action.payload;
        },
        updateRealtimeData: (state, action) => {
            // Handle WebSocket updates here
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.businessHealthScore = action.payload.businessHealthScore;
                state.inventoryMetrics = action.payload.inventoryMetrics;
                state.recommendations = action.payload.recommendations;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    },
});

export const { setDateRange, updateRealtimeData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
