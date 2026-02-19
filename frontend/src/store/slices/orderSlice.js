import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/orders', orderData);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
});

export const fetchFarmerOrders = createAsyncThunk('orders/fetchFarmer', async (params = {}, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await api.get(`/orders/farmer?${queryString}`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
});

export const fetchBuyerOrders = createAsyncThunk('orders/fetchBuyer', async (params = {}, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await api.get(`/orders/buyer?${queryString}`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
});

export const respondToOrder = createAsyncThunk('orders/respond', async ({ orderId, response }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/orders/${orderId}/respond`, response);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to respond');
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        currentOrder: null,
        pagination: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearOrderError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
            .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchFarmerOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.orders;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchFarmerOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchBuyerOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchBuyerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.orders;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchBuyerOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(respondToOrder.fulfilled, (state, action) => {
                const index = state.items.findIndex(o => o._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            });
    },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
