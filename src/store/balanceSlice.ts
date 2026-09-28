import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BalanceState } from '../types/wallet';
import { getRpcProvider } from '../api/rpcProvider';
import { fetchEthPriceInUsd } from '../api/priceApi';
import { formatEthValue } from '../utils/formatters';

export const fetchBalanceAndPrice = createAsyncThunk(
  'balance/fetchBalanceAndPrice',
  async ({ address, rpcUrl }: { address: string; rpcUrl: string }) => {
    const provider = getRpcProvider(rpcUrl);
    
    // Fetch raw Wei balance and USD market price concurrently
    const [rawBalance, ethPrice] = await Promise.all([
      provider.getBalance(address),
      fetchEthPriceInUsd(),
    ]);

    const ethBalance = formatEthValue(rawBalance);
    const usdValue = (parseFloat(ethBalance) * ethPrice).toFixed(2);

    return { ethBalance, usdBalance: usdValue, ethPriceUsd: ethPrice };
  }
);

const initialState: BalanceState = {
  ethBalance: '0.0000',
  usdBalance: '0.00',
  ethPriceUsd: 0,
  loading: false,
  error: null,
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceAndPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceAndPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.ethBalance = action.payload.ethBalance;
        state.usdBalance = action.payload.usdBalance;
        state.ethPriceUsd = action.payload.ethPriceUsd;
      })
      .addCase(fetchBalanceAndPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch balance';
      });
  },
});

export default balanceSlice.reducer;