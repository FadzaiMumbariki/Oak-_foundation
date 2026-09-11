import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScanLine, ChevronRight, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { CheckInStackParamList } from '@/navigation/types';
import type { AttendeeAdmin } from '@/types';

type Nav = NativeStackNavigationProp<CheckInStackParamList, 'CheckInScanner'>;

const SIMULATED_ATTENDEES: (AttendeeAdmin & { type: 'Partner' | 'OAK Staff'; qr_token: string })[] = [
  {
    id: '1',
    full_name: 'Collin Manyande',
    organization: 'Africa Climate Alliance',
    sub_partner: null,
    role_title: 'Programme Lead',
    type: 'Partner',
    email: 'c.manyande@africaclimatealliance.org',
    phone: null,
    dietary_needs: null,
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: 'OAK-2026-7842-XKPH',
  },
  {
    id: '2',
    full_name: 'James Odhiambo',
    organization: 'OAK Foundation',
    sub_partner: null,
    role_title: 'Portfolio Manager',
    type: 'OAK Staff',
    email: 'j.odhiambo@oakfnd.org',
    phone: null,
    dietary_needs: null,
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: 'OAK-2026-1193-JWQA',
  },
  {
    id: '3',
    full_name: 'Kayden Mamu',
    organization: 'Digital Frontiers Institute',
    sub_partner: null,
    role_title: 'Research Fellow',
    type: 'Partner',
    email: 'k.mamu@digitalfrontiers.org',
    phone: null,
    dietary_needs: null,
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: 'OAK-2026-5592-FWBN',
  },
];

export default function CheckInScreen() {
  const navigation = useNavigation<Nav>();
  const [manualCode, setManualCode] = useState('');
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [scanLineAnim] = useState(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(lineAnim, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    a.start();
    return a;
  });

  const lineTop = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 220],
  });

  const handleSimulate = (att: typeof SIMULATED_ATTENDEES[number]) => {
    // ~70% success rate, some tokens fail for demo
    if (att.qr_token.includes('XXXX')) {
      navigation.navigate('CheckInError', { error: 'Invalid token' });
    } else {
      navigation.navigate('CheckInSuccess', {
        attendee: att,
        checkedInAt: new Date().toISOString(),
        nextSession: 'Opening Plenary',
        venue: 'Main Hall A',
      });
    }
  };

  const handleManualCheck = () => {
    if (!manualCode.trim()) return;
    const found = SIMULATED_ATTENDEES.find(
      (a) => a.qr_token.toUpperCase() === manualCode.trim().toUpperCase()
    );
    if (found) {
      handleSimulate(found);
    } else if (manualCode.length >= 8) {
      navigation.navigate('CheckInError', { error: `Code ${manualCode} not recognised` });
    } else {
      navigation.navigate('CheckInError', {});
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Event Check-In</Text>
          <Text style={styles.pageSubtitle}>Scan an attendee QR code to check them in</Text>
        </View>

        <Card style={styles.scannerCard} variant="dark" padding={0}>
          <View style={styles.scannerViewport}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: lineTop }],
                  },
                ]}
              />
            </View>
            <Text style={styles.scannerHint}>Position QR code within the frame</Text>
          </View>
          <View style={styles.scannerFooter}>
            <View style={styles.iconBadge}>
              <ScanLine size={18} color="rgba(255,255,255,0.5)" strokeWidth={2} />
            </View>
            <Text style={styles.scannerFooterText}>
              Hold camera steady · Auto-scans in 1–2 seconds
            </Text>
          </View>
        </Card>

        <Card style={styles.simulateCard}>
          <Text style={styles.sectionLabel}>SIMULATE QR SCAN</Text>
          <View style={styles.simulateList}>
            {SIMULATED_ATTENDEES.map((att) => (
              <TouchableOpacity
                key={att.id}
                activeOpacity={0.7}
                onPress={() => handleSimulate(att)}
                style={styles.simulateItem}
              >
                <Avatar name={att.full_name} size={44} variant="navy" />
                <View style={styles.simulateInfo}>
                  <Text style={styles.simulateName}>{att.full_name}</Text>
                  <Text style={styles.simulateToken}>{att.qr_token}</Text>
                </View>
                <Tag
                  label={att.type}
                  tone={att.type === 'OAK Staff' ? 'mint' : 'default'}
                  dot={att.type === 'OAK Staff'}
                />
                <ChevronRight size={18} color={OAK_BRAND.grey} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.manualCard}>
          <Text style={styles.sectionLabel}>MANUAL CODE ENTRY</Text>
          <View style={styles.manualRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="OAK-2026-XXXX-XXXX"
              placeholderTextColor={OAK_BRAND.grey}
              value={manualCode}
              onChangeText={(t) => setManualCode(t.toUpperCase())}
              autoCapitalize="characters"
            />
            <Button
              title="Check"
              size="md"
              onPress={handleManualCheck}
              disabled={!manualCode.trim()}
              style={{ minWidth: 100 }}
            />
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
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  scannerCard: {
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  scannerViewport: {
    backgroundColor: '#0F1A2E',
    paddingVertical: 40,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: 'relative',
    marginBottom: 32,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: 'rgba(82,183,136,0.9)',
    borderRadius: 2,
    shadowColor: '#52B788',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  scannerHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: FONT.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  scannerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  scannerFooterText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: FONT.caption,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: OAK_BRAND.grey,
    marginBottom: SPACING.md,
    marginTop: 2,
  },
  simulateCard: { marginBottom: SPACING.xl },
  simulateList: { gap: SPACING.sm },
  simulateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: OAK_BRAND.greyLight,
  },
  simulateInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  simulateName: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: OAK_BRAND.navy,
  },
  simulateToken: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  manualCard: {},
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#EEF0F5',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: FONT.body,
    fontWeight: '500',
    color: OAK_BRAND.navy,
    letterSpacing: 0.5,
  },
});
