import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { RootState, AppDispatch } from '../store';
import { setWalletAddress } from '../store/walletSlice';
import { getWalletCredentials } from '../utils/secureStorage';
import { useBalance } from '../hooks/useBalance';
import { AddressChip } from '../components/AddressChip';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { TransactionHistory } from '../components/TransactionHistory';
import { NetworkSelectorModal } from '../components/NetworkSelectorModal';
import { COLORS } from '../utils/theme';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const { address, network } = useSelector((state: RootState) => state.wallet);
  const { ethBalance, usdBalance, loading, refreshBalance } = useBalance();

  useEffect(() => {
    initWallet();
  }, []);

  const initWallet = async () => {
    try {
      const credentials = await getWalletCredentials();
      if (credentials?.address) {
        dispatch(setWalletAddress(credentials.address));
      }
    } catch (error) {
      console.error('Failed to load wallet credentials from Keystore:', error);
      Alert.alert('Security Error', 'Failed to retrieve wallet keys.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.networkBadge}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.networkDot} />
            <Text style={styles.networkText}>{network.name} ▼</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {address ? <AddressChip address={address} /> : null}
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Balance Card */}
        <LinearGradient
          colors={[...COLORS.gradientCard]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>

          {loading ? (
            <View style={{ marginVertical: 12, alignItems: 'center' }}>
              <SkeletonLoader width={160} height={38} borderRadius={10} />
              <SkeletonLoader
                width={80}
                height={18}
                borderRadius={6}
                style={{ marginTop: 8 }}
              />
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.balanceValue}>
                {ethBalance} {network.symbol || 'ETH'}
              </Text>
              <Text style={styles.usdValue}>≈ ${usdBalance} USD</Text>
            </View>
          )}

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Send')}
            >
              <Text style={styles.actionIcon}>↑</Text>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Receive')}
            >
              <Text style={styles.actionIcon}>↓</Text>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={refreshBalance}
            >
              <Text style={styles.actionIcon}>↻</Text>
              <Text style={styles.actionText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Recent Transaction History Section */}
        <TransactionHistory />
      </ScrollView>

      {/* Network Switcher Modal */}
      <NetworkSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  networkText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '500' },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  balanceLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  balanceValue: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '700',
    marginTop: 8,
  },
  usdValue: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: { alignItems: 'center' },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    color: COLORS.textPrimary,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 48,
    overflow: 'hidden',
    marginBottom: 6,
  },
  actionText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '500' },
});

export default Home;
