import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, SPACING, FONTS } from '../../utils/theme';
import { Button } from '../../components/Button';
import { getWalletCredentials } from '../../utils/secureStorage';

const Onboarding = () => {
  const navigation = useNavigation<any>();
  const [checkingWallet, setCheckingWallet] = useState(true);

  useEffect(() => {
    checkExistingWallet();
  }, []);

  const checkExistingWallet = async () => {
    try {
      const credentials = await getWalletCredentials();
      if (credentials?.address) {
        // Wallet already exists on device, bypass onboarding
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return;
      }
    } catch (error) {
      console.error('Error checking wallet keystore status:', error);
    } finally {
      setCheckingWallet(false);
    }
  };

  if (checkingWallet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo / Badge */}
        <LinearGradient
          colors={[COLORS.primary, '#1E264D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoBadge}>
          <Text style={styles.logoIcon}>⚡</Text>
        </LinearGradient>

        <Text style={styles.title}>Crypto Wallet</Text>
        <Text style={styles.subtitle}>
          Securely create, store, and manage your Web3 assets on Ethereum testnets and mainnets.
        </Text>

        <View style={styles.featuresBox}>
          <Text style={styles.featureItem}>🔒 Encrypted Key Storage</Text>
          <Text style={styles.featureItem}>⚡ Fast Gas & Balance Polling</Text>
          <Text style={styles.featureItem}>🌐 Multi-Network Support</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        <Button
          title="Create New Wallet"
          onPress={() => navigation.navigate('CreateWallet')}
          style={styles.button}
        />
        <Button
          title="Import Existing Wallet"
          variant="secondary"
          onPress={() => navigation.navigate('ImportWallet')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoIcon: {
    fontSize: 44,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: FONTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  featuresBox: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    width: '100%',
    gap: 10,
  },
  featureItem: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: FONTS.medium,
  },
  actionContainer: {
    marginBottom: SPACING.lg,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});

export default Onboarding;