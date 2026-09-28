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
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';

import { RootState, AppDispatch } from '../store';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Button } from '../components/Button';
import { getWalletCredentials } from '../utils/secureStorage';
import { fetchBalanceAndPrice } from '../store/balanceSlice';

const Send = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { address, network } = useSelector((state: RootState) => state.wallet);
  const { ethBalance } = useSelector((state: RootState) => state.balance);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!ethers.isAddress(recipient)) {
      Alert.alert('Invalid Address', 'Please enter a valid Ethereum public address.');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to send.');
      return;
    }

    if (parseFloat(amount) > parseFloat(ethBalance)) {
      Alert.alert('Insufficient Funds', 'You do not have enough ETH to cover this transaction.');
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch private key securely
      const credentials = await getWalletCredentials();
      if (!credentials?.privateKey) {
        throw new Error('Private key unavailable.');
      }

      // 2. Setup RPC Provider & Wallet Signer
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const walletSigner = new ethers.Wallet(credentials.privateKey, provider);

      // 3. Send transaction
      const tx = await walletSigner.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      Alert.alert(
        'Transaction Submitted',
        `Hash: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}\n\nYour transfer is being mined!`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (address && network.rpcUrl) {
                dispatch(fetchBalanceAndPrice({ address, rpcUrl: network.rpcUrl }));
              }
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Send Error:', error);
      Alert.alert('Transaction Failed', error?.reason || error?.message || 'Transaction encountered an error.');
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
            <Text style={styles.headerTitle}>Send ETH</Text>
            <View style={{ width: 50 }} />
          </View>

          {/* Form */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Recipient Address</Text>
            <TextInput
              style={styles.input}
              placeholder="0x..."
              placeholderTextColor={COLORS.textSecondary}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Amount (ETH)</Text>
              <Text style={styles.balanceHint}>Available: {ethBalance} ETH</Text>
            </View>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="0.0"
                placeholderTextColor={COLORS.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={styles.maxButton}
                onPress={() => setAmount(ethBalance)}>
                <Text style={styles.maxText}>MAX</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <Button
            title={loading ? 'Broadcasting...' : 'Send Now'}
            onPress={handleSend}
            loading={loading}
            disabled={loading || !recipient || !amount}
            style={styles.sendBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  formGroup: { marginTop: SPACING.lg },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: FONTS.medium, marginBottom: SPACING.xs },
  balanceHint: { color: COLORS.primary, fontSize: 12, fontWeight: FONTS.medium },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 12,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    height: 48,
    fontSize: 14,
  },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center' },
  maxButton: {
    position: 'absolute',
    right: 12,
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  maxText: { color: COLORS.primary, fontSize: 11, fontWeight: FONTS.bold },
  sendBtn: { marginVertical: SPACING.lg },
});

export default Send;