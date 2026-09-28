import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../store';
import { switchNetwork } from '../store/walletSlice';
import { SUPPORTED_NETWORKS, NetworkConfig } from '../utils/network';
import { COLORS, SPACING, FONTS } from '../utils/theme';

interface NetworkSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NetworkSelectorModal: React.FC<NetworkSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeNetwork = useSelector((state: RootState) => state.wallet.network);

  const handleSelect = (networkId: string) => {
    dispatch(switchNetwork(networkId));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Text style={styles.title}>Select Network</Text>
              
              {Object.values(SUPPORTED_NETWORKS).map((net: NetworkConfig) => {
                const isSelected = net.id === activeNetwork.id;
                return (
                  <TouchableOpacity
                    key={net.id}
                    style={[styles.networkRow, isSelected && styles.selectedRow]}
                    onPress={() => handleSelect(net.id)}>
                    <View style={styles.networkInfo}>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: net.isTestnet ? '#EAB308' : COLORS.success },
                        ]}
                      />
                      <Text style={styles.networkName}>{net.name}</Text>
                    </View>
                    {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.md,
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedRow: {
    backgroundColor: COLORS.chipBg,
    borderColor: COLORS.primary,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  networkName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: FONTS.medium,
  },
  checkmark: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
});