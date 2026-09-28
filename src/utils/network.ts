export interface NetworkConfig {
  id: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  symbol: string;
  explorerUrl: string;
  isTestnet: boolean;
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    id: 'sepolia',
    name: 'Sepolia Testnet',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    chainId: 11155111,
    symbol: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true,
  },
  mainnet: {
    id: 'mainnet',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    chainId: 1,
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
    isTestnet: false,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-bor-rpc.publicnode.com',
    chainId: 137,
    symbol: 'POL',
    explorerUrl: 'https://polygonscan.com',
    isTestnet: false,
  },
};