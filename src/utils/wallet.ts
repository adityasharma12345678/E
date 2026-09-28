import {Wallet} from 'ethers';

export const createWallet = () => {
  return Wallet.createRandom();
};

export const importWallet = (phrase: string) => {
  return Wallet.fromPhrase(phrase.trim());
};