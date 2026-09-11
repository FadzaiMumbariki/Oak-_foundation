import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Check, Download, RefreshCw } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { RegisterStackParamList } from '@/navigation/types';

type Route = RouteProp<RegisterStackParamList, 'RegistrationSuccess'>;

export default function RegistrationSuccessScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { attendee } = route.params;

  const handleDownload = async () => {
    try {
      await Share.share({
        message: `OAK Partner Convening 2026 Entry Pass\n\nName: ${attendee.full_name}\nOrganisation: ${attendee.organization}\nCode: ${attendee.qr_token}`,
        title: 'OAK Entry Pass',
      });
    } catch {
      Alert.alert('Saved', 'Entry pass details shared.');
    }
  };

  const handleRegisterAnother = () => {
    navigation.popToTop();
  };

  const first = attendee.full_name.split(' ')[0] || attendee.full_name;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[OAK_BRAND.navy, OAK_BRAND.navyLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.successBanner}
        >
          <View style={styles.successIcon}>
            <Check size={28} color={OAK_BRAND.white} strokeWidth={3} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.successEyebrow}>REGISTRATION COMPLETE</Text>
            <Text style={styles.successTitle}>
              You're Registered, {first}!
            </Text>
            <Text style={styles.successOrg}>{attendee.organization}</Text>
          </View>
        </LinearGradient>

        <Card style={styles.qrCard}>
          <Text style={styles.cardSectionTitle}>YOUR ENTRY PASS</Text>
          <View style={styles.qrWrap}>
            <QRCode
              value={attendee.qr_token}
              size={200}
              color={OAK_BRAND.navy}
              backgroundColor="transparent"
              ecl="M"
            />
          </View>
          <Text style={styles.qrToken}>{attendee.qr_token}</Text>
          <Text style={styles.qrHint}>Present at event entrance for check-in</Text>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.cardSectionTitle}>REGISTRATION DETAILS</Text>
          <View style={styles.detailsTable}>
            {[
              ['Name', attendee.full_name],
              ['Organisation', attendee.organization],
              ['Role', attendee.role_title],
              ['Email', attendee.email],
              ['Location', 'Harare, Zimbabwe'],
            ].map(([k, v], idx, arr) => (
              <View
                key={k}
                style={[
                  styles.detailRow,
                  idx !== arr.length - 1 && styles.detailRowBorder,
                ]}
              >
                <Text style={styles.detailKey}>{k}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{v}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button
          title="Download QR Code"
          icon={<Download size={20} color={OAK_BRAND.white} strokeWidth={2.2} />}
          onPress={handleDownload}
          style={styles.downloadBtn}
        />

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleRegisterAnother}
          style={styles.registerAnother}
        >
          <RefreshCw size={18} color={OAK_BRAND.grey} strokeWidth={2} />
          <Text style={styles.registerAnotherText}>Register another attendee</Text>
        </TouchableOpacity>
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
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 6,
  },
  successIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  successEyebrow: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  successTitle: {
    color: OAK_BRAND.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  successOrg: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT.body,
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  qrCard: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1.8,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  qrWrap: {
    backgroundColor: '#EEF0F5',
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
  },
  qrToken: {
    fontSize: 18,
    fontWeight: '700',
    color: OAK_BRAND.navy,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  qrHint: {
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  detailsCard: {
    marginBottom: SPACING.xxl,
  },
  detailsTable: {
    marginTop: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: OAK_BRAND.greyLight,
  },
  detailKey: {
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  downloadBtn: { marginBottom: SPACING.xl },
  registerAnother: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  registerAnotherText: {
    marginLeft: SPACING.sm,
    color: OAK_BRAND.grey,
    fontSize: FONT.body,
    fontWeight: '600',
  },
});
