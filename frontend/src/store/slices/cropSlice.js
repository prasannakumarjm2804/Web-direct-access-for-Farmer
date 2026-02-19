import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCrops = createAsyncThunk('crops/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await api.get(`/crops?${queryString}`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch crops');
    }
});

export const fetchCropById = createAsyncThunk('crops/fetchById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/crops/${id}`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Crop not found');
    }
});

export const createCrop = createAsyncThunk('crops/create', async (cropData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/crops', cropData);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create crop');
    }
});

export const fetchMyCrops = createAsyncThunk('crops/fetchMine', async (params = {}, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await api.get(`/crops/my/listings?${queryString}`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch crops');
    }
});

const cropSlice = createSlice({
    name: 'crops',
    initialState: {
        items: [],
        myCrops: [],
        currentCrop: null,
        pagination: null,
        loading: false,
        error: null,
        filters: {
            category: '',
            state: '',
            minPrice: '',
            maxPrice: '',
            quality: '',
            organic: '',
            search: '',
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { category: '', state: '', minPrice: '', maxPrice: '', quality: '', organic: '', search: '' };
        },
        clearCurrentCrop: (state) => {
            state.currentCrop = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCrops.pending, (state) => { state.loading = true; })
            .addCase(fetchCrops.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.crops;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchCrops.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchCropById.pending, (state) => { state.loading = true; })
            .addCase(fetchCropById.fulfilled, (state, action) => { state.loading = false; state.currentCrop = action.payload; })
            .addCase(fetchCropById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createCrop.pending, (state) => { state.loading = true; })
            .addCase(createCrop.fulfilled, (state, action) => {
                state.loading = false;
                state.myCrops.unshift(action.payload);
            })
            .addCase(createCrop.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchMyCrops.pending, (state) => { state.loading = true; })
            .addCase(fetchMyCrops.fulfilled, (state, action) => {
                state.loading = false;
                state.myCrops = action.payload.crops;
            })
            .addCase(fetchMyCrops.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { setFilters, clearFilters, clearCurrentCrop } = cropSlice.actions;
export default cropSlice.reducer;
