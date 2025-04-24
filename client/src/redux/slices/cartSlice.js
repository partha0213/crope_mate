import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, quantity }, { getState }) => {
    const { data } = await axios.get(`${API_URL}/api/products/${id}`);

    const item = {
      product: data._id,
      name: data.name,
      image: data.images[0],
      price: data.price,
      countInStock: data.countInStock,
      quantity,
      seller: data.seller,
      productData: data,
    };

    const { cart } = getState();
    const updatedCartItems = [...cart.cartItems];
    
    const existingItemIndex = updatedCartItems.findIndex(
      (x) => x.product === item.product
    );

    if (existingItemIndex !== -1) {
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedCartItems.push(item);
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    return updatedCartItems;
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { getState }) => {
    const { cart } = getState();
    const updatedCartItems = cart.cartItems.filter((x) => x.product !== id);

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    return updatedCartItems;
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ id, quantity }, { getState }) => {
    const { cart } = getState();
    const updatedCartItems = [...cart.cartItems];
    
    const existingItemIndex = updatedCartItems.findIndex(
      (x) => x.product === id
    );

    if (existingItemIndex !== -1) {
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity,
      };
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    return updatedCartItems;
  }
);

// Clear cart
export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  localStorage.removeItem('cartItems');
  return [];
});

const initialState = {
  cartItems: cartItemsFromStorage,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // Update cart item quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export default cartSlice.reducer;