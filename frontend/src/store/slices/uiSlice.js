import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sidebarOpen: false,
        mobileMenuOpen: false,
        language: localStorage.getItem('language') || 'en',
        theme: localStorage.getItem('theme') || 'light',
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
        setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
        toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
        setLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        setNotifications: (state, action) => { state.notifications = action.payload; },
        setUnreadCount: (state, action) => { state.unreadCount = action.payload; },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
    },
});

export const {
    toggleSidebar, setSidebarOpen, toggleMobileMenu,
    setLanguage, setTheme,
    setNotifications, setUnreadCount, addNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
