import React from 'react';
import {SafeAreaView, View, Text, Button, StyleSheet} from 'react-native';
import {Wallet} from 'ethers';

type Props = {
  wallet: Wallet;
  onSend: () => void;
  onReceive: () => void;
};

const WalletHome = ({wallet, onSend, onReceive}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Ethereum Wallet</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Wallet Address</Text>

        <Text selectable style={styles.address}>
          {wallet.address}
        </Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.label}>ETH Balance</Text>

        <Text style={styles.balance}>
          0.0000 ETH
        </Text>

        <Text style={styles.note}>
          Balance will be connected to Ethereum next.
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Receive"
          onPress={onReceive}
        />

        <View style={styles.space} />

        <Button
          title="Send"
          onPress={onSend}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  balanceCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    fontSize: 13,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  note: {
    marginTop: 10,
    fontSize: 12,
  },
  buttons: {
    marginTop: 10,
  },
  space: {
    height: 12,
  },
});

export default WalletHome;