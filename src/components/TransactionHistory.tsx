import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { RootState } from '../store';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { SkeletonLoader } from './SkeletonLoader';
import { truncateAddress } from '../utils/formatters';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError?: string;
  isInternal?: boolean;
}

export const TransactionHistory = () => {
  const { address, network } = useSelector((state: RootState) => state.wallet);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!address) return;

    try {
      let baseUrl = '';
      if (network.chainId === 11155111) {
        baseUrl = 'https://api-sepolia.etherscan.io/api';
      } else if (network.chainId === 1) {
        baseUrl = 'https://api.etherscan.io/api';
      } else {
        setLoading(false);
        return;
      }

      // Query standard (external) and internal (faucet/contract) transfers in parallel
      const txUrl = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=15&sort=desc`;
      const internalTxUrl = `${baseUrl}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=1&offset=15&sort=desc`;

      const [txRes, internalRes] = await Promise.all([
        fetch(txUrl).then((r) => r.json()).catch(() => ({ status: '0', result: [] })),
        fetch(internalTxUrl).then((r) => r.json()).catch(() => ({ status: '0', result: [] })),
      ]);

      const standardTxs: Transaction[] =
        txRes.status === '1' && Array.isArray(txRes.result) ? txRes.result : [];

      const internalTxs: Transaction[] =
        internalRes.status === '1' && Array.isArray(internalRes.result)
          ? internalRes.result.map((tx: Transaction) => ({ ...tx, isInternal: true }))
          : [];

      // Combine both arrays
      const combined = [...standardTxs, ...internalTxs];

      // Remove duplicates by unique hash and zero out 0 ETH fee-only calls
      const uniqueTxs = combined.reduce<Transaction[]>((acc, current) => {
        const exists = acc.find(
          (item) => item.hash.toLowerCase() === current.hash.toLowerCase()
        );
        if (!exists && current.value !== '0') {
          acc.push(current);
        }
        return acc;
      }, []);

      // Sort descending by timestamp (newest first)
      uniqueTxs.sort((a, b) => parseInt(b.timeStamp, 10) - parseInt(a.timeStamp, 10));

      setTransactions(uniqueTxs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [address, network.chainId]);

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const openExplorer = (hash: string) => {
    if (network.explorerUrl) {
      Linking.openURL(`${network.explorerUrl}/tx/${hash}`);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const isSent = item.from.toLowerCase() === address?.toLowerCase();
    const formattedValue = parseFloat(ethers.formatEther(item.value || '0')).toFixed(4);
    const dateStr = new Date(parseInt(item.timeStamp, 10) * 1000).toLocaleDateString(
      undefined,
      { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );

    return (
      <TouchableOpacity
        style={styles.txRow}
        onPress={() => openExplorer(item.hash)}>
        <View style={styles.iconContainer}>
          <Text style={styles.txIcon}>{isSent ? '↗' : '↙'}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.txType}>
            {isSent ? 'Sent ETH' : item.isInternal ? 'Faucet Deposit' : 'Received ETH'}
          </Text>
          <Text style={styles.txMeta}>{dateStr}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.txAmount, { color: isSent ? COLORS.textPrimary : COLORS.success }]}>
            {isSent ? `- ${formattedValue}` : `+ ${formattedValue}`} {network.symbol || 'ETH'}
          </Text>
          <Text style={styles.txHash}>{truncateAddress(item.hash)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Recent Activity</Text>

      {loading ? (
        <View style={styles.skeletonGroup}>
          {[1, 2, 3].map((key) => (
            <View key={key} style={styles.skeletonRow}>
              <SkeletonLoader width={40} height={40} borderRadius={20} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <SkeletonLoader width={100} height={16} borderRadius={6} />
                <SkeletonLoader width={70} height={12} borderRadius={4} style={{ marginTop: 6 }} />
              </View>
              <SkeletonLoader width={80} height={18} borderRadius={6} />
            </View>
          ))}
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyText}>No recent transactions found on {network.name}.</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => `${item.hash}-${index}`}
          renderItem={renderItem}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: SPACING.xl, flex: 1 },
  sectionHeader: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.md,
  },
  skeletonGroup: { gap: 12 },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.chipBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txIcon: { color: COLORS.primary, fontSize: 18, fontWeight: FONTS.bold },
  details: { flex: 1 },
  txType: { color: COLORS.textPrimary, fontSize: 14, fontWeight: FONTS.semibold },
  txMeta: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  amountContainer: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: FONTS.bold },
  txHash: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 28, marginBottom: 8 },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center' },
});