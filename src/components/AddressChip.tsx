import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { truncateAddress } from '../utils/formatters';

interface AddressChipProps {
  address: string;
}

export const AddressChip: React.FC<AddressChipProps> = ({ address }) => {
  const handleCopy = () => {
    if (!address) return;
    Clipboard.setString(address);
    Alert.alert('Copied!', 'Public address copied to clipboard.');
  };

  return (
    <TouchableOpacity style={styles.chip} onPress={handleCopy}>
      <Text style={styles.text}>{truncateAddress(address)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#16192E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E264D',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});