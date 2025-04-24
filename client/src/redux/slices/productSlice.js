import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all products
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async ({ keyword = '', pageNumber = '', category = '', filters = {} }, { rejectWithValue }) => {
    try {
      let url = `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
      
      if (category) {
        url += `&category=${category}`;
      }
      
      // Add filters to the query
      if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
      if (filters.rating) url += `&rating=${filters.rating}`;
      if (filters.isOrganic) url += `&isOrganic=${filters.isOrganic}`;
      if (filters.quality) url += `&quality=${filters.quality}`;
      
      const { data } = await axios.get(url);
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

// Get product details
export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
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

// Get seller products
export const getSellerProducts = createAsyncThunk(
  'products/getSellerProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get('/api/products/seller', config);
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

// Create product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post('/api/products', productData, config);
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

// Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(`/api/products/${id}`, productData, config);
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

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`/api/products/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create product review
export const createProductReview = createAsyncThunk(
  'products/createProductReview',
  async ({ productId, review }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`/api/products/${productId}/reviews`, review, config);
      return { success: true };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: { reviews: [] },
    pages: 0,
    page: 0,
    loading: false,
    error: null,
    success: false,
    reviewSuccess: false,
  },
  reducers: {
    resetProductDetails: (state) => {
      state.product = { reviews: [] };
    },
    resetProductSuccess: (state) => {
      state.success = false;
    },
    resetReviewSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get seller products
      .addCase(getSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, action.payload];
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product review
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviewSuccess = false;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.loading = false;
        state.reviewSuccess = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reviewSuccess = false;
      });
  },
});

export const { resetProductDetails, resetProductSuccess, resetReviewSuccess } = productSlice.actions;
export default productSlice.reducer;