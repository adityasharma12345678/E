import * as Keychain from 'react-native-keychain';

const WALLET_KEY_SERVICE = 'com.ethereumwallet.keys';

/**
 * Saves the encrypted mnemonic or private key to native secure storage.
 */
export const saveWalletCredentials = async (
  walletAddress: string,
  mnemonic: string,
) => {
  try {
    await Keychain.setGenericPassword(walletAddress, mnemonic, {
      service: WALLET_KEY_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch (error) {
    console.error('Failed to save secure wallet credentials:', error);
    return false;
  }
};

/**
 * Retrieves stored wallet credentials from native secure storage.
 */
export const getWalletCredentials = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: WALLET_KEY_SERVICE,
    });
    console.log(credentials)
    if (credentials) {
      return {
        address: credentials.username,
        mnemonic: credentials.password,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve secure wallet credentials:', error);
    return null;
  }
};


//import EncryptedStorage from 'react-native-encrypted-storage';
// OR if using Keychain:
// import * as Keychain from 'react-native-keychain';

export const deleteWalletCredentials = async (): Promise<boolean> => {
  try {
    // await EncryptedStorage.clear(); 
    // If using react-native-keychain:
    await Keychain.resetGenericPassword();
    return true;
  } catch (error) {
    console.error('Failed to wipe wallet credentials:', error);
    return false;
  }
};
