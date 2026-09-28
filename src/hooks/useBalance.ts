import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchBalanceAndPrice } from '../store/balanceSlice';

export const useBalance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address, network } = useSelector((state: RootState) => state.wallet);
  const balanceState = useSelector((state: RootState) => state.balance);

  const refreshBalance = () => {
    if (address && network.rpcUrl) {
      dispatch(fetchBalanceAndPrice({ address, rpcUrl: network.rpcUrl }));
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [address, network]);

  return {
    ...balanceState,
    refreshBalance,
  };
};