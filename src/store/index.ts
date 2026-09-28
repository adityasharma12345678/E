import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import balanceReducer from './balanceSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    balance: balanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;