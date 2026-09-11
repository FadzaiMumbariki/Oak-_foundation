import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OAK_BRAND, SPACING } from '@/theme';

export default function OakHeader() {
  return (
    <LinearGradient
      colors={[OAK_BRAND.navy, OAK_BRAND.navyLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.inner}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoIcon}>◎</Text>
            <Text style={styles.logoTextBold}>AK</Text>
          </View>
          <View style={styles.verticalBar} />
          <Text style={styles.eventName}>PARTNER CONVENING 2026</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 58 : 40,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  inner: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoIcon: {
    color: OAK_BRAND.white,
    fontSize: 22,
    fontWeight: '700',
    marginRight: -2,
  },
  logoTextBold: {
    color: OAK_BRAND.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  verticalBar: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  eventName: {
    color: OAK_BRAND.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1.6,
  },
});
