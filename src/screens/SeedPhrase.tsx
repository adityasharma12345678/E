import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import Clipboard from '@react-native-clipboard/clipboard';

import { RootStackParamList } from '../../App';
import { AppDispatch } from '../store';
import { setWalletAddress } from '../store/walletSlice';
import { saveWalletCredentials } from '../utils/secureStorage';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Button } from '../components/Button';

type SeedPhraseRouteProp = RouteProp<RootStackParamList, 'SeedPhrase'>;

const SeedPhrase = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SeedPhraseRouteProp>();
  const dispatch = useDispatch<AppDispatch>();

  const mnemonic = route.params?.mnemonic || '';
  const words = mnemonic.split(' ');
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(mnemonic);
    Alert.alert('Copied!', 'Mnemonic phrase copied to clipboard.');
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // 1. Derive wallet from mnemonic phrase
      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      // 2. Persist address and private key in Android Keystore / Keychain
      await saveWalletCredentials(wallet.address, wallet.privateKey, mnemonic);

      // 3. Update Redux store state
      dispatch(setWalletAddress(wallet.address));

      // 4. Reset navigation stack to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Failed to finalize wallet setup:', error);
      Alert.alert('Setup Error', 'Failed to save wallet securely. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seed Phrase</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Your 12-Word Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          Write these down in order and keep them somewhere safe.
        </Text>

        {/* 2-Column Mnemonic Grid */}
        <View style={styles.grid}>
          {words.map((word, index) => (
            <View key={index} style={styles.wordChip}>
              <Text style={styles.wordIndex}>{index + 1}.</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyText}>Copy to Clipboard</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <Button
          title={loading ? 'Saving Wallet...' : 'I Have Saved It'}
          onPress={handleContinue}
          loading={loading}
          disabled={loading || !mnemonic}
          style={styles.doneBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.md,
  },
  backButton: { paddingVertical: SPACING.xs },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: FONTS.semibold },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: FONTS.bold },
  title: { color: COLORS.textPrimary, fontSize: 20, fontWeight: FONTS.bold, marginTop: SPACING.sm },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  wordChip: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordIndex: { color: COLORS.textSecondary, fontSize: 12, width: 24 },
  wordText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: FONTS.semibold },
  copyBtn: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  copyText: { color: COLORS.primary, fontSize: 13, fontWeight: FONTS.semibold },
  doneBtn: { marginVertical: SPACING.lg },
});

export default SeedPhrase;