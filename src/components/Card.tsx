import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../constants';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  headerRight?: React.ReactNode;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  style,
  titleStyle,
  headerRight,
  onPress,
}) => {
  const content = (
    <>
      {(title || headerRight) && (
        <View style={styles.header}>
          {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : <View />}
          {headerRight}
        </View>
      )}
      <View style={styles.body}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.86}
        accessibilityRole="button"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{content}</View>;
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
