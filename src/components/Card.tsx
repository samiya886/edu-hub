import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS } from '../constants';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  headerRight?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  style,
  titleStyle,
  headerRight,
}) => {
  return (
    <View style={[styles.card, style]}>
      {(title || headerRight) && (
        <View style={styles.header}>
          {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : <View />}
          {headerRight}
        </View>
      )}
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceMuted,
    paddingBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  body: {
    width: '100%',
  },
});
