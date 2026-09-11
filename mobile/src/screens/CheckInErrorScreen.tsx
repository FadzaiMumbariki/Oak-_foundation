import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, AlertTriangle, RefreshCcw, Phone } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { CheckInStackParamList } from '@/navigation/types';

type Route = RouteProp<CheckInStackParamList, 'CheckInError'>;

const REASONS = [
  'QR code belongs to a different event',
  'Registration was not completed',
  'Code has been altered or corrupted',
  'Attendee registered under a different email',
];

export default function CheckInErrorScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const detail = route.params?.error;

  const handleTryAgain = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="error" style={styles.errorBanner}>
          <View style={styles.errorIcon}>
            <X size={30} color={OAK_BRAND.white} strokeWidth={3} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.errorEyebrow}>CHECK-IN FAILED</Text>
            <Text style={styles.errorTitle}>QR Not Recognised</Text>
            <Text style={styles.errorSub}>
              {detail || 'Code is invalid or unregistered'}
            </Text>
          </View>
        </Card>

        <Card style={styles.reasonsCard}>
          <View style={styles.reasonsHeader}>
            <View style={styles.warningIcon}>
              <AlertTriangle size={20} color={OAK_BRAND.error} strokeWidth={2.2} />
            </View>
            <Text style={styles.reasonsTitle}>Possible reasons</Text>
          </View>
          <View style={styles.reasonsList}>
            {REASONS.map((r, i) => (
              <View key={r} style={styles.reasonItem}>
                <View style={styles.reasonBullet}>
                  <View style={styles.bulletDot} />
                </View>
                <Text style={styles.reasonText}>{r}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button
          title="Try Again"
          icon={<RefreshCcw size={20} color={OAK_BRAND.white} strokeWidth={2.3} />}
          onPress={handleTryAgain}
          style={styles.primaryBtn}
        />
        <Button
          title="Contact Coordination Team"
          icon={<Phone size={20} color={OAK_BRAND.navy} strokeWidth={2.2} />}
          variant="secondary"
          onPress={() => {}}
          style={styles.secondaryBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: OAK_BRAND.offWhite },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl * 2 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  errorEyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  errorTitle: {
    color: OAK_BRAND.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  errorSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT.body,
    fontWeight: '500',
  },
  reasonsCard: {
    marginBottom: SPACING.xxl,
  },
  reasonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  warningIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: OAK_BRAND.error + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  reasonsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.2,
  },
  reasonsList: { gap: SPACING.md },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reasonBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: OAK_BRAND.error + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 3,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: OAK_BRAND.error,
  },
  reasonText: {
    flex: 1,
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '500',
    lineHeight: 24,
    paddingTop: 1,
  },
  primaryBtn: { marginBottom: SPACING.md },
  secondaryBtn: {},
});
