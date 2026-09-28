export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  symbol: string;
}

export interface WalletState {
  address: string | null;
  network: NetworkConfig;
  isInitialized: boolean;
}

export interface BalanceState {
  ethBalance: string;
  usdBalance: string;
  ethPriceUsd: number;
  loading: boolean;
  error: string | null;
}