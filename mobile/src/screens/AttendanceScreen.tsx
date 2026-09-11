import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, ScanLine } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';

const OVERVIEW = [
  { label: 'Expected', value: '110', tone: 'navy' },
  { label: 'Checked In', value: '0', tone: 'green' },
  { label: 'Pending', value: '110', tone: 'grey' },
] as const;

const TONE_BG: Record<string, string> = {
  navy: OAK_BRAND.navy,
  green: OAK_BRAND.green,
  grey: OAK_BRAND.grey,
};

export default function AttendanceScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Attendance</Text>
          <Text style={styles.pageSubtitle}>Check-in tracking · 9–11 March 2026</Text>
        </View>

        <Card style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Users size={44} color={OAK_BRAND.grey} strokeWidth={1.7} />
          </View>
          <Text style={styles.emptyTitle}>No check-ins yet</Text>
          <Text style={styles.emptyDesc}>
            Attendees will appear here once they have been scanned in at the event entrance.
          </Text>
          <Button
            title="Go to Check-In Scanner"
            icon={<ScanLine size={22} color={OAK_BRAND.white} strokeWidth={2.3} />}
            onPress={() => navigation.navigate('CheckInStack', { screen: 'CheckInScanner' })}
            style={styles.ctaBtn}
          />
        </Card>

        <Card style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>EVENT OVERVIEW</Text>
          <View style={styles.overviewRow}>
            {OVERVIEW.map((o) => (
              <View key={o.label} style={styles.overviewItem}>
                <Text style={[styles.overviewValue, { color: TONE_BG[o.tone] }]}>
                  {o.value}
                </Text>
                <Text style={styles.overviewLabel}>{o.label}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: OAK_BRAND.offWhite },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl * 2 },
  pageHeader: { marginBottom: SPACING.xl },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: FONT.h3,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 48,
    marginBottom: SPACING.xl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: '#EEF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.3,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  ctaBtn: {
    width: '100%',
  },
  overviewCard: {},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1.6,
    marginBottom: SPACING.lg,
  },
  overviewRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  overviewItem: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F2F4F8',
    borderRadius: RADIUS.xl - 4,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: FONT.caption,
    color: OAK_BRAND.grey,
    fontWeight: '600',
  },
});
