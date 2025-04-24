import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all transactions
export const getTransactions = createAsyncThunk(
  'transaction/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/transactions');
      return res.data.transactions;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to fetch transactions');
    }
  }
);

// Get transaction by ID
export const getTransactionById = createAsyncThunk(
  'transaction/getTransactionById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/transactions/${id}`);
      return res.data.transaction;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to fetch transaction');
    }
  }
);

// Create transaction
export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/transactions', transactionData);
      return res.data.transaction;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to create transaction');
    }
  }
);

// Update transaction
export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/transactions/${id}`, transactionData);
      return res.data.transaction;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Failed to update transaction');
    }
  }
);

const initialState = {
  transactions: [],
  transaction: null,
  loading: false,
  error: null
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearTransaction: (state) => {
      state.transaction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get transaction by ID
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
        state.transaction = action.payload;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
        state.transactions = state.transactions.map(transaction => 
          transaction._id === action.payload._id ? action.payload : transaction
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTransactionError, clearTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;