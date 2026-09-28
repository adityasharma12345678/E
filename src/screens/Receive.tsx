import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

import { RootState } from '../store';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Button } from '../components/Button';
import { truncateAddress } from '../utils/formatters';

const Receive = () => {
  const navigation = useNavigation();
  const { address, network } = useSelector((state: RootState) => state.wallet);

  const handleCopy = () => {
    if (!address) return;
    Clipboard.setString(address);
    Alert.alert('Copied!', 'Public address copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {/* Network Info */}
        <View style={styles.networkBox}>
          <Text style={styles.networkLabel}>Deposit Network</Text>
          <Text style={styles.networkValue}>{network.name}</Text>
        </View>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <Text style={styles.cardTitle}>Your Public Address</Text>
          <Text style={styles.addressFull} selectTextOnPress>
            {address || 'No wallet connected'}
          </Text>

          <TouchableOpacity style={styles.copyPill} onPress={handleCopy}>
            <Text style={styles.copyPillText}>Copy Full Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Send only <Text style={styles.highlightText}>ETH ({network.name})</Text> to this address. Sending other assets may result in permanent loss.
          </Text>
        </View>
      </View>

      <Button title="Done" onPress={() => navigation.goBack()} style={styles.doneBtn} />
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
  networkBox: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  networkLabel: { color: COLORS.textSecondary, fontSize: 12 },
  networkValue: { color: COLORS.success, fontSize: 14, fontWeight: FONTS.semibold, marginTop: 2 },
  addressCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: { color: COLORS.textSecondary, fontSize: 13, marginBottom: SPACING.sm },
  addressFull: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: FONTS.medium,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  copyPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  copyPillText: { color: COLORS.textPrimary, fontWeight: FONTS.semibold, fontSize: 13 },
  warningBox: {
    backgroundColor: '#1C1210',
    borderColor: '#3D201A',
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  warningText: { color: '#E58A7B', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  highlightText: { fontWeight: FONTS.bold, color: COLORS.textPrimary },
  doneBtn: { marginBottom: SPACING.lg },
});

export default Receive;