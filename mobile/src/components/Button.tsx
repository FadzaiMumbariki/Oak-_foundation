import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { OAK_BRAND, SPACING, RADIUS, FONT } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'md' | 'lg';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled,
  loading,
  icon,
  iconRight,
  style,
  textStyle,
}: Props) {
  const container = [
    styles.base,
    size === 'lg' ? styles.sizeLg : styles.sizeMd,
    styles[variant],
    disabled && !loading ? styles.disabled : null,
    style,
  ];
  const txt = [styles.text, styles[`text_${variant}`] as TextStyle, textStyle];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={container}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? OAK_BRAND.white : OAK_BRAND.navy} />
      ) : (
        <>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={txt}>{title}</Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
  },
  sizeLg: {
    height: 60,
    paddingHorizontal: SPACING.xl,
  },
  sizeMd: {
    height: 48,
    paddingHorizontal: SPACING.lg,
  },
  primary: {
    backgroundColor: OAK_BRAND.navy,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  secondary: {
    backgroundColor: OAK_BRAND.white,
    borderWidth: 1,
    borderColor: OAK_BRAND.greyLight,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: OAK_BRAND.navy,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FONT.body,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  text_primary: {
    color: OAK_BRAND.white,
  },
  text_secondary: {
    color: OAK_BRAND.navy,
  },
  text_outline: {
    color: OAK_BRAND.navy,
  },
  text_ghost: {
    color: OAK_BRAND.grey,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});
