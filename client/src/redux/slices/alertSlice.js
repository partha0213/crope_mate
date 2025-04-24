import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all alerts
export const getAlerts = createAsyncThunk(
  'alert/getAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/alerts');
      return res.data.alerts;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to fetch alerts');
    }
  }
);

// Mark alert as read
export const markAlertAsRead = createAsyncThunk(
  'alert/markAlertAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/alerts/${id}/read`);
      return res.data.alert;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to mark alert as read');
    }
  }
);

const initialState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    clearAlertError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all alerts
      .addCase(getAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter(alert => !alert.read).length;
      })
      .addCase(getAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark alert as read
      .addCase(markAlertAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAlertAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = state.alerts.map(alert => 
          alert._id === action.payload._id ? action.payload : alert
        );
        state.unreadCount = state.alerts.filter(alert => !alert.read).length;
      })
      .addCase(markAlertAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAlertError } = alertSlice.actions;

export default alertSlice.reducer;