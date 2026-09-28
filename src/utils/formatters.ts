import { ethers } from 'ethers';

export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEthValue = (weiBigInt: bigint, decimalPlaces: number = 4): string => {
  try {
    const ethStr = ethers.formatEther(weiBigInt);
    return parseFloat(ethStr).toFixed(decimalPlaces);
  } catch {
    return '0.0000';
  }
};