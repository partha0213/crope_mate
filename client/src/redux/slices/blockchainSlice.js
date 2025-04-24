import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// Connect to MetaMask
export const connectWallet = createAsyncThunk(
  'blockchain/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        throw new Error('Please install MetaMask!');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      
      return {
        connected: true,
        account: accounts[0],
        networkId
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to connect wallet');
    }
  }
);

// Check if wallet is connected
export const checkWalletConnection = createAsyncThunk(
  'blockchain/checkWalletConnection',
  async (_, { rejectWithValue }) => {
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        return {
          connected: false,
          account: null,
          networkId: null
        };
      }
      
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      if (accounts.length === 0) {
        return {
          connected: false,
          account: null,
          networkId: null
        };
      }
      
      const networkId = await web3.eth.net.getId();
      
      return {
        connected: true,
        account: accounts[0],
        networkId
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to check wallet connection');
    }
  }
);

const initialState = {
  connected: false,
  account: null,
  networkId: null,
  loading: false,
  error: null
};

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    clearBlockchainError: (state) => {
      state.error = null;
    },
    disconnectWallet: (state) => {
      state.connected = false;
      state.account = null;
      state.networkId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Connect wallet
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.connected = action.payload.connected;
        state.account = action.payload.account;
        state.networkId = action.payload.networkId;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check wallet connection
      .addCase(checkWalletConnection.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkWalletConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connected = action.payload.connected;
        state.account = action.payload.account;
        state.networkId = action.payload.networkId;
      })
      .addCase(checkWalletConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBlockchainError, disconnectWallet } = blockchainSlice.actions;

export default blockchainSlice.reducer;