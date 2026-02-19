import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cropReducer from './slices/cropSlice';
import orderReducer from './slices/orderSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        crops: cropReducer,
        orders: orderReducer,
        ui: uiReducer,
    },
    devTools: import.meta.env.DEV,
});

export default store;
