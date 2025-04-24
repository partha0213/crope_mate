import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  sidebarOpen: false,
  filterDrawerOpen: false,
  searchQuery: '',
  activeFilters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    qualityGrade: '',
    sortBy: 'newest',
  },
  viewMode: localStorage.getItem('viewMode') || 'grid',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleFilterDrawer: (state) => {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    setFilterDrawerOpen: (state, action) => {
      state.filterDrawerOpen = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.activeFilters = {
        category: '',
        minPrice: '',
        maxPrice: '',
        qualityGrade: '',
        sortBy: 'newest',
      };
      state.searchQuery = '';
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid';
      localStorage.setItem('viewMode', state.viewMode);
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      localStorage.setItem('viewMode', action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        isRead: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      });
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleFilterDrawer,
  setFilterDrawerOpen,
  setSearchQuery,
  setActiveFilters,
  resetFilters,
  toggleViewMode,
  setViewMode,
  addNotification,
  markNotificationAsRead,
  clearAllNotifications,
  markAllNotificationsAsRead,
} = uiSlice.actions;

export default uiSlice.reducer;