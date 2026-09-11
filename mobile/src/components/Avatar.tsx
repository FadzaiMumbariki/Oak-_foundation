import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { OAK_BRAND } from '@/theme';
import { getInitials } from '@/utils/format';

type Props = {
  name: string;
  size?: number;
  variant?: 'navy' | 'green' | 'gold' | 'mint' | 'grey';
  style?: ViewStyle;
};

const BG: Record<NonNullable<Props['variant']>, string> = {
  navy: OAK_BRAND.navy,
  green: OAK_BRAND.green,
  gold: OAK_BRAND.gold,
  mint: '#E6F4EC',
  grey: '#EEF0F5',
};

const FG: Record<NonNullable<Props['variant']>, string> = {
  navy: OAK_BRAND.white,
  green: OAK_BRAND.white,
  gold: OAK_BRAND.white,
  mint: OAK_BRAND.green,
  grey: OAK_BRAND.grey,
};

export default function Avatar({ name, size = 52, variant = 'navy', style }: Props) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: BG[variant],
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: FG[variant], fontSize: size * 0.38 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
