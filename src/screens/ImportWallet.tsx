import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';

import { AppDispatch } from '../store';
import { setWalletAddress } from '../store/walletSlice';
import { saveWalletCredentials } from '../utils/secureStorage';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Button } from '../components/Button';

const ImportWallet = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    const cleanInput = input.trim();

    if (!cleanInput) {
      Alert.alert('Empty Input', 'Please enter your seed phrase or private key.');
      return;
    }

    setLoading(true);

    try {
      let importedWallet: ethers.HDNodeWallet | ethers.Wallet;

      // 1. Check if input is a valid 12 or 24 word mnemonic phrase
      if (cleanInput.split(/\s+/).length >= 12) {
        importedWallet = ethers.Wallet.fromPhrase(cleanInput);
      } 
      // 2. Fallback: Check if input is a valid raw private key
      else if (cleanInput.length === 64 || cleanInput.length === 66) {
        const formattedKey = cleanInput.startsWith('0x') ? cleanInput : `0x${cleanInput}`;
        importedWallet = new ethers.Wallet(formattedKey);
      } else {
        throw new Error('Invalid format. Please enter a 12-word seed phrase or a valid 64-character private key.');
      }

      // 3. Persist imported wallet in secure storage
      const mnemonicToSave = importedWallet.mnemonic ? importedWallet.mnemonic.phrase : '';
      await saveWalletCredentials(importedWallet.address, importedWallet.privateKey, mnemonicToSave);

      // 4. Update Redux state
      dispatch(setWalletAddress(importedWallet.address));

      // 5. Navigate to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error: any) {
      console.error('Import Error:', error);
      Alert.alert('Import Failed', error?.message || 'Invalid recovery phrase or private key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Import Wallet</Text>
            <View style={{ width: 50 }} />
          </View>

          <Text style={styles.title}>Restore from Secret Key</Text>
          <Text style={styles.subtitle}>
            Enter your 12/24-word seed phrase (separated by spaces) or your 64-character private key.
          </Text>

          {/* Text Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. apple banana cherry ... OR 0x123..."
              placeholderTextColor={COLORS.textSecondary}
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={4}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              🔒 Your keys are encrypted and stored locally in your device's native hardware security enclave.
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          <Button
            title={loading ? 'Importing Wallet...' : 'Import Wallet'}
            onPress={handleImport}
            loading={loading}
            disabled={loading || !input.trim()}
            style={styles.actionBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.md,
  },
  backButton: { paddingVertical: SPACING.xs },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: FONTS.semibold },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: FONTS.bold },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: FONTS.bold,
    marginTop: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
  },
  textArea: {
    color: COLORS.textPrimary,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
  },
  infoCard: {
    backgroundColor: COLORS.chipBg,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  actionBtn: {
    marginVertical: SPACING.lg,
  },
});

export default ImportWallet;