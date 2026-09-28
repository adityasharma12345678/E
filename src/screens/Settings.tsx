import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../store';
import { clearWallet } from '../store/walletSlice';
import { deleteWalletCredentials } from '../utils/secureStorage';
import { truncateAddress } from '../utils/formatters';
import { COLORS, SPACING, FONTS } from '../utils/theme';

export const Settings = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { address, network } = useSelector((state: RootState) => state.wallet);

  const handleLogout = () => {
    Alert.alert(
      'Remove Wallet',
      'Are you sure you want to remove this wallet? Make sure you have backed up your seed phrase!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            // 1. Wipe keystore from hardware enclave
            await deleteWalletCredentials();

            // 2. Clear global Redux state
            dispatch(clearWallet());

            // 3. Reset navigation tree directly to Onboarding
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Active Wallet</Text>
        <Text style={styles.cardValue}>{address ? truncateAddress(address) : 'None'}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.cardLabel}>Active Network</Text>
        <Text style={styles.cardValue}>{network.name}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🔒 Remove Wallet & Reset App</Text>
      </TouchableOpacity>
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
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: FONTS.semibold },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: FONTS.bold },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  cardLabel: { color: COLORS.textSecondary, fontSize: 12 },
  cardValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: FONTS.semibold, marginTop: 4 },
  divider: { height: 1, backgroundColor: COLORS.surfaceBorder, marginVertical: SPACING.md },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  logoutText: { color: '#EF4444', fontWeight: FONTS.bold, fontSize: 14 },
});