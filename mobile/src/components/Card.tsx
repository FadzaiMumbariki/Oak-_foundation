import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { OAK_BRAND, SPACING, RADIUS } from '@/theme';

type CardProps = ViewProps & {
  variant?: 'default' | 'elevated' | 'dark' | 'success' | 'error';
  padding?: number;
};

export default function Card({ variant = 'default', padding, style, children, ...rest }: CardProps) {
  const variantStyle = {
    default: styles.cardDefault,
    elevated: styles.cardElevated,
    dark: styles.cardDark,
    success: styles.cardSuccess,
    error: styles.cardError,
  }[variant];

  const padStyle = padding !== undefined ? { padding } : styles.defaultPad;

  return (
    <View style={[styles.card, variantStyle, padStyle, style]} {...rest}>
      {children}
    </View>
  );
}

const SHADOW = {
  shadowColor: OAK_BRAND.navy,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 3,
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
  },
  defaultPad: {
    padding: SPACING.xl,
  },
  cardDefault: {
    backgroundColor: OAK_BRAND.white,
    ...SHADOW,
  },
  cardElevated: {
    backgroundColor: OAK_BRAND.white,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 6,
  },
  cardDark: {
    backgroundColor: OAK_BRAND.navy,
    ...SHADOW,
  },
  cardSuccess: {
    backgroundColor: OAK_BRAND.green,
    ...SHADOW,
  },
  cardError: {
    backgroundColor: OAK_BRAND.error,
    ...SHADOW,
  },
});
