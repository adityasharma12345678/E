import { ethers } from 'ethers';

export const getRpcProvider = (rpcUrl: string) => {
  return new ethers.JsonRpcProvider(rpcUrl);
};