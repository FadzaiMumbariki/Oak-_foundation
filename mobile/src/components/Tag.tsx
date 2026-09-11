import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OAK_BRAND, SPACING, RADIUS, FONT } from '@/theme';

type Tone =
  | 'default'
  | 'navy'
  | 'green'
  | 'gold'
  | 'purple'
  | 'coral'
  | 'lilac'
  | 'peach'
  | 'mint'
  | 'blue';

type Props = {
  label: string;
  tone?: Tone;
  dot?: boolean;
};

const TONES: Record<Tone, { bg: string; text: string; dot?: string }> = {
  default: { bg: '#EEF0F5', text: OAK_BRAND.navy },
  navy: { bg: OAK_BRAND.navy, text: OAK_BRAND.white, dot: OAK_BRAND.navy },
  green: { bg: '#E6F4EC', text: OAK_BRAND.green, dot: OAK_BRAND.green },
  gold: { bg: '#FBF3DF', text: '#8C7324', dot: OAK_BRAND.gold },
  purple: { bg: '#F1ECF8', text: '#6B4EA8', dot: '#8B5CF6' },
  coral: { bg: '#FDEEE5', text: '#B95C2E', dot: '#F97316' },
  lilac: { bg: '#F3EFFB', text: '#6E59A5' },
  peach: { bg: '#FEF1E7', text: '#A65A35' },
  mint: { bg: '#E6F7EE', text: OAK_BRAND.green },
  blue: { bg: '#E8EFFB', text: OAK_BRAND.navyLight },
};

export default function Tag({ label, tone = 'default', dot }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: t.dot ?? t.text }]} />}
      <Text style={[styles.label, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: FONT.small,
    fontWeight: '600',
  },
});
