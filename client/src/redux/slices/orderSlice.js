import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Create order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
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
        `${API_URL}/api/orders`,
        orderData,
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

// Get order details
export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/orders/${id}`, config);

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

// Pay order
export const payOrder = createAsyncThunk(
  'orders/payOrder',
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(
        `${API_URL}/api/orders/${orderId}/pay`,
        paymentResult,
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

// Get my orders
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
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

      const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);

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

// Get all orders (admin)
export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
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

      const { data } = await axios.get(`${API_URL}/api/orders`, config);

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

// Update order to delivered
export const deliverOrder = createAsyncThunk(
  'orders/deliverOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/orders/${orderId}/deliver`,
        {},
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

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status },
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

// Create dispute
export const createDispute = createAsyncThunk(
  'orders/createDispute',
  async ({ orderId, disputeData }, { getState, rejectWithValue }) => {
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
        `${API_URL}/api/orders/${orderId}/dispute`,
        disputeData,
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

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  paySuccess: false,
  deliverSuccess: false,
  disputeSuccess: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
      state.paySuccess = false;
      state.deliverSuccess = false;
      state.disputeSuccess = false;
    },
    clearOrderDetails: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paySuccess = false;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.paySuccess = true;
        state.error = null;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paySuccess = false;
      })
      // Get my orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deliver order
      .addCase(deliverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deliverSuccess = false;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.deliverSuccess = true;
        state.error = null;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.deliverSuccess = false;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create dispute
      .addCase(createDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.disputeSuccess = false;
      })
      .addCase(createDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.disputeSuccess = true;
        state.error = null;
      })
      .addCase(createDispute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.disputeSuccess = false;
      });
  },
});

export const { clearOrderError, resetOrderSuccess, clearOrderDetails } =
  orderSlice.actions;

export default orderSlice.reducer;