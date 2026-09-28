import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '../types/wallet';
import { SUPPORTED_NETWORKS } from '../utils/network';

const initialState: WalletState = {
  address: null,
  network: SUPPORTED_NETWORKS.sepolia,
  isInitialized: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.isInitialized = true;
    },
    switchNetwork: (state, action: PayloadAction<string>) => {
      const selectedNetwork = SUPPORTED_NETWORKS[action.payload];
      if (selectedNetwork) {
        state.network = selectedNetwork;
      }
    },
    clearWallet: (state) => {
      state.address = null;
      state.isInitialized = false;
    },
  },
});

export const { setWalletAddress, switchNetwork, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;