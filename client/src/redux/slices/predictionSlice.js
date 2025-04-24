import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all predictions
export const getPredictions = createAsyncThunk(
  'prediction/getPredictions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/predictions');
      return res.data.predictions;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to fetch predictions');
    }
  }
);

// Get prediction by ID
export const getPredictionById = createAsyncThunk(
  'prediction/getPredictionById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/predictions/${id}`);
      return res.data.prediction;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to fetch prediction');
    }
  }
);

// Create prediction
export const createPrediction = createAsyncThunk(
  'prediction/createPrediction',
  async (predictionData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/predictions/analyze', predictionData);
      return res.data.prediction;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to create prediction');
    }
  }
);

const initialState = {
  predictions: [],
  prediction: null,
  loading: false,
  error: null
};

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    clearPredictionError: (state) => {
      state.error = null;
    },
    clearPrediction: (state) => {
      state.prediction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all predictions
      .addCase(getPredictions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload;
      })
      .addCase(getPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get prediction by ID
      .addCase(getPredictionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPredictionById.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(getPredictionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create prediction
      .addCase(createPrediction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions.unshift(action.payload);
        state.prediction = action.payload;
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPredictionError, clearPrediction } = predictionSlice.actions;

export default predictionSlice.reducer;