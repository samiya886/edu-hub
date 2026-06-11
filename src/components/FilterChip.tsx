import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.78} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  active: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.warningBg,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '900',
  },
  activeText: {
    color: COLORS.primaryDark,
  },
});
