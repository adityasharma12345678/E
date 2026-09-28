import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';

import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Button } from '../components/Button';

const CreateWallet = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const handleGenerateWallet = () => {
    setLoading(true);
    try {
      // Generate a random 12-word BIP-39 mnemonic phrase
      const randomWallet = ethers.Wallet.createRandom();
      const mnemonic = randomWallet.mnemonic?.phrase;

      if (!mnemonic) {
        throw new Error('Failed to generate mnemonic phrase.');
      }

      // Pass mnemonic to SeedPhrase screen for confirmation/backup
      navigation.navigate('SeedPhrase', { mnemonic });
    } catch (error) {
      console.error('Wallet Creation Error:', error);
      Alert.alert('Error', 'Could not generate wallet. Please try again.');
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
        <Text style={styles.headerTitle}>Create Wallet</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.shieldIcon}>🛡️</Text>
        </View>

        <Text style={styles.title}>Backup Secret Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          In the next step, you will see a 12-word recovery phrase. It is the ONLY way to recover your funds if you lose your phone or switch devices.
        </Text>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Security First</Text>
          <Text style={styles.warningText}>
            • Never share your seed phrase with anyone.{'\n'}
            • Store it offline in a safe physical place.{'\n'}
            • Support will NEVER ask for your secret recovery phrase.
          </Text>
        </View>
      </View>

      <Button
        title={loading ? 'Generating...' : 'Generate Secret Phrase'}
        onPress={handleGenerateWallet}
        loading={loading}
        style={styles.actionBtn}
      />
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
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  shieldIcon: { fontSize: 36 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: FONTS.bold, textAlign: 'center', marginBottom: SPACING.sm },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  warningCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    width: '100%',
  },
  warningTitle: { color: COLORS.danger, fontSize: 14, fontWeight: FONTS.bold, marginBottom: SPACING.xs },
  warningText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  actionBtn: { marginBottom: SPACING.lg },
});

export default CreateWallet;