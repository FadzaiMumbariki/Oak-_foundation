import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, MapPin, Users, ScanLine, CircleDot } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { CheckInStackParamList } from '@/navigation/types';
import { formatDateTime } from '@/utils/format';

type Route = RouteProp<CheckInStackParamList, 'CheckInSuccess'>;

export default function CheckInSuccessScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { attendee, checkedInAt, nextSession, venue } = route.params;
  const { time, date } = formatDateTime(checkedInAt);

  const TOTAL_ATTENDEES = 110;
  const CHECKED_IN = 74;
  const pct = (CHECKED_IN / TOTAL_ATTENDEES) * 100;

  const handleScanNext = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="success" style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Check size={30} color={OAK_BRAND.white} strokeWidth={3} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>Checked In Successfully</Text>
            <Text style={styles.successTime}>
              <MapPin size={14} color="rgba(255,255,255,0.75)" style={{ marginRight: 6 }} />
              {time} · {date}
            </Text>
          </View>
        </Card>

        <Card style={styles.attendeeCard}>
          <View style={styles.attendeeHeader}>
            <Avatar name={attendee.full_name} size={68} variant="navy" />
            <View style={styles.attendeeInfo}>
              <Text style={styles.attendeeName}>{attendee.full_name}</Text>
              <Text style={styles.attendeeOrg}>{attendee.organization}</Text>
              <View style={{ marginTop: 10 }}>
                <Tag
                  label="Partner"
                  tone="default"
                  dot
                />
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Users size={18} color={OAK_BRAND.navy} strokeWidth={2} />
              </View>
              <Text style={styles.metricLabel}>NEXT SESSION</Text>
              <Text style={styles.metricValue}>{nextSession ?? 'Opening Plenary'}</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <MapPin size={18} color={OAK_BRAND.navy} strokeWidth={2} />
              </View>
              <Text style={styles.metricLabel}>VENUE</Text>
              <Text style={styles.metricValue}>{venue ?? 'Main Hall A'}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.statusCard}>
          <Text style={styles.cardSectionTitle}>LIVE EVENT STATUS</Text>
          <View style={styles.statusLine}>
            <View style={styles.liveDotWrap}>
              <View style={styles.liveDot} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Opening Plenary starting at 09:30</Text>
              <Text style={styles.statusSub}>
                {CHECKED_IN} of {TOTAL_ATTENDEES} attendees checked in · Main Hall A
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        </Card>

        <Button
          title="Scan Next Attendee"
          icon={<ScanLine size={22} color={OAK_BRAND.white} strokeWidth={2.3} />}
          onPress={handleScanNext}
          style={styles.scanBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: OAK_BRAND.offWhite },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl * 2 },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  successTitle: {
    color: OAK_BRAND.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  successTime: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT.body,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeCard: {
    marginBottom: SPACING.xl,
  },
  attendeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeInfo: { flex: 1, marginLeft: SPACING.lg },
  attendeeName: {
    fontSize: 24,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.3,
  },
  attendeeOrg: {
    fontSize: FONT.h3,
    color: OAK_BRAND.grey,
    marginTop: 4,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: OAK_BRAND.greyLight,
    marginVertical: SPACING.xxl,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    gap: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F2F4F8',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: OAK_BRAND.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: FONT.h3,
    fontWeight: '700',
    color: OAK_BRAND.navy,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1.8,
    marginBottom: SPACING.lg,
  },
  statusCard: { marginBottom: SPACING.xxl },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  liveDotWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: OAK_BRAND.greenAccent + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: OAK_BRAND.greenAccent,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: OAK_BRAND.navy,
    marginBottom: 4,
  },
  statusSub: {
    fontSize: FONT.caption,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#EEF0F5',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: OAK_BRAND.navy,
    borderRadius: RADIUS.full,
  },
  scanBtn: {
    shadowColor: OAK_BRAND.navy,
  },
});
