import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Get crop quality grade
export const getCropQualityGrade = createAsyncThunk(
  'ai/getCropQualityGrade',
  async (imageData, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/ai/crop-quality`,
        { image: imageData },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get price prediction
export const getPricePrediction = createAsyncThunk(
  'ai/getPricePrediction',
  async (cropData, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/ai/price-prediction`,
        cropData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get best time to sell
export const getBestTimeToSell = createAsyncThunk(
  'ai/getBestTimeToSell',
  async (cropData, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/ai/best-time-to-sell`,
        cropData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get market trends
export const getMarketTrends = createAsyncThunk(
  'ai/getMarketTrends',
  async (params, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { category, region, timeframe } = params || {};
      let url = `${API_URL}/api/ai/market-trends?`;
      
      if (category) url += `category=${category}&`;
      if (region) url += `region=${region}&`;
      if (timeframe) url += `timeframe=${timeframe}`;

      const { data } = await axios.get(url, config);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get AI alerts
export const getAIAlerts = createAsyncThunk(
  'ai/getAIAlerts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/ai/alerts`, config);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get AI insights for dashboard
export const getAIInsights = createAsyncThunk(
  'ai/getAIInsights',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/ai/insights`, config);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  cropQuality: null,
  pricePrediction: null,
  bestTimeToSell: null,
  marketTrends: null,
  alerts: [],
  insights: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAIError: (state) => {
      state.error = null;
    },
    clearAIData: (state) => {
      state.cropQuality = null;
      state.pricePrediction = null;
      state.bestTimeToSell = null;
      state.marketTrends = null;
    },
    markAlertAsRead: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.map(alert => 
        alert._id === alertId ? { ...alert, isRead: true } : alert
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Get crop quality grade
      .addCase(getCropQualityGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCropQualityGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.cropQuality = action.payload;
        state.error = null;
      })
      .addCase(getCropQualityGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get price prediction
      .addCase(getPricePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPricePrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.pricePrediction = action.payload;
        state.error = null;
      })
      .addCase(getPricePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get best time to sell
      .addCase(getBestTimeToSell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBestTimeToSell.fulfilled, (state, action) => {
        state.loading = false;
        state.bestTimeToSell = action.payload;
        state.error = null;
      })
      .addCase(getBestTimeToSell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get market trends
      .addCase(getMarketTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.marketTrends = action.payload;
        state.error = null;
      })
      .addCase(getMarketTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get AI alerts
      .addCase(getAIAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAIAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
        state.error = null;
      })
      .addCase(getAIAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get AI insights
      .addCase(getAIInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAIInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
        state.error = null;
      })
      .addCase(getAIInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAIError, clearAIData, markAlertAsRead } = aiSlice.actions;

export default aiSlice.reducer;