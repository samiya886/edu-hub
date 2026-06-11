import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '../constants';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.loaderMark}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.brand,
    zIndex: 9999,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  loaderMark: {
    width: 76,
    height: 76,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
});
