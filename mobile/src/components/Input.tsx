import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { OAK_BRAND, SPACING, RADIUS, FONT } from '@/theme';

type Props = TextInputProps & {
  label?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
};

export default function Input({
  label,
  required,
  containerStyle,
  rightIcon,
  onRightPress,
  style,
  ...rest
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <View style={styles.inputWrap}>
        <TextInput
          placeholderTextColor={OAK_BRAND.grey}
          style={[styles.input, !!rightIcon && styles.inputPadRight, style]}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onRightPress}
            style={styles.rightIcon}
            disabled={!onRightPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT.small,
    fontWeight: '600',
    color: OAK_BRAND.navy,
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  asterisk: {
    color: OAK_BRAND.error,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#EEF0F5',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '500',
  },
  inputPadRight: {
    paddingRight: 56,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 8,
  },
});
