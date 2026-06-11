import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface HeaderProps {
  title: string;
  onLeftPress?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightBadgeCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onLeftPress,
  leftIcon = 'menu-outline',
  onRightPress,
  rightIcon = 'notifications-outline',
  rightBadgeCount = 0,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {onLeftPress ? (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name={leftIcon} size={24} color={COLORS.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {onRightPress ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name={rightIcon} size={24} color={COLORS.text} />
            {rightBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{rightBadgeCount > 9 ? '9+' : rightBadgeCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.brand,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  spacer: {
    width: 40,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.error,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
