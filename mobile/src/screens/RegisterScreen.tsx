import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, CalendarDays, Building2, ChevronDown, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { RegisterStackParamList } from '@/navigation/types';
import type { AttendeeAdmin } from '@/types';
import { generateQrCode } from '@/utils/format';

type Nav = NativeStackNavigationProp<RegisterStackParamList, 'RegisterForm'>;

const ROLE_OPTIONS = [
  'Partner Representative',
  'OAK Staff',
  'Sub-Partner Lead',
  'Programme Officer',
  'Consultant / Advisor',
  'Observer',
];

const STATS = [
  { icon: Users, value: '110+', label: 'Attendees' },
  { icon: CalendarDays, value: '24', label: 'Sessions' },
  { icon: Building2, value: '38', label: 'Partners' },
];

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [subPartner, setSubPartner] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietary, setDietary] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [travel, setTravel] = useState('');
  const [consent, setConsent] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    organisation.trim() &&
    role &&
    email.trim() &&
    consent;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Missing fields', 'Please complete all required fields and agree to the privacy policy.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const attendee: AttendeeAdmin = {
      id: `mock-${Date.now()}`,
      full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      organization: organisation.trim(),
      sub_partner: subPartner.trim() || null,
      role_title: role,
      email: email.trim(),
      phone: phone.trim() || null,
      dietary_needs: dietary.trim() || null,
      accessibility_needs: accessibility.trim() || null,
      travel_needs: travel.trim() || null,
      consent_given: true,
      qr_token: generateQrCode(),
      created_at: new Date().toISOString(),
    };
    setLoading(false);
    navigation.navigate('RegistrationSuccess', { attendee });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="dark" style={styles.hero}>
          <Text style={styles.heroTitle}>Partner{'\n'}Convening 2026</Text>
          <Text style={styles.heroSubtitle}>Geneva · 9–11 March 2026</Text>
        </Card>

        <View style={styles.statsRow}>
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} style={styles.statCard}>
                <View style={styles.statIconWrap}>
                  <Icon size={22} color={OAK_BRAND.navy} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </Card>
            );
          })}
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Registration Form</Text>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                label="First Name"
                required
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Maria"
                containerStyle={{ flex: 1 }}
              />
            </View>
            <View style={styles.rowGap} />
            <View style={styles.rowItem}>
              <Input
                label="Last Name"
                required
                value={lastName}
                onChangeText={setLastName}
                placeholder="Schmidt"
                containerStyle={{ flex: 1 }}
              />
            </View>
          </View>

          <Input
            label="Organisation"
            required
            value={organisation}
            onChangeText={setOrganisation}
            placeholder="Your organisation name"
          />

          <Input
            label="Sub-Partner / Programme Area"
            value={subPartner}
            onChangeText={setSubPartner}
            placeholder="Optional"
          />

          <View style={styles.selectWrap}>
            <Text style={styles.selectLabel}>
              Role / Capacity<Text style={styles.asterisk}> *</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setRoleOpen((v) => !v)}
              style={styles.selectButton}
            >
              <Text style={[styles.selectValue, !role && styles.placeholder]}>
                {role || 'Select your role'}
              </Text>
              <ChevronDown
                size={20}
                color={OAK_BRAND.grey}
                style={{ transform: [{ rotate: roleOpen ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
            {roleOpen && (
              <View style={styles.selectDropdown}>
                {ROLE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.6}
                    onPress={() => {
                      setRole(opt);
                      setRoleOpen(false);
                    }}
                    style={[
                      styles.selectOption,
                      role === opt && styles.selectOptionActive,
                    ]}
                  >
                    <Text style={[styles.selectOptionText, role === opt && styles.selectOptionTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Input
            label="Email Address"
            required
            value={email}
            onChangeText={setEmail}
            placeholder="you@organisation.org"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+41 xx xxx xx xx"
            keyboardType="phone-pad"
          />

          <View style={styles.requirementsWrap}>
            <Text style={styles.requirementsTitle}>Requirements</Text>
            <Input
              label="Dietary Requirements"
              value={dietary}
              onChangeText={setDietary}
              placeholder="e.g. Vegetarian, Halal, Gluten-free"
              containerStyle={{ marginBottom: SPACING.md }}
            />
            <Input
              label="Accessibility Requirements"
              value={accessibility}
              onChangeText={setAccessibility}
              placeholder="e.g. Wheelchair access, hearing loop"
              containerStyle={{ marginBottom: SPACING.md }}
            />
            <Input
              label="Travel & Accommodation"
              value={travel}
              onChangeText={setTravel}
              placeholder="e.g. Flight from London, hotel needed"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setConsent((v) => !v)}
            style={styles.consentRow}
          >
            <View style={[styles.checkbox, consent && styles.checkboxOn]}>
              {consent && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              I agree to OAK Foundation's{' '}
              <Text style={styles.consentLink}>privacy policy</Text> and consent to my registration data being used for event coordination.
            </Text>
          </TouchableOpacity>

          <Button
            title="Register"
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            disabled={!canSubmit}
            style={styles.submitButton}
          />

          <View style={styles.footerNote}>
            <ShieldCheck size={16} color={OAK_BRAND.grey} style={{ marginRight: 6 }} />
            <Text style={styles.footerText}>
              Your data is secured and handled by OAK Foundation in accordance with GDPR.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: OAK_BRAND.offWhite },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl * 2 },
  hero: {
    marginBottom: SPACING.xl,
    padding: SPACING.xxl,
  },
  heroTitle: {
    color: OAK_BRAND.white,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 40,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONT.h3,
    marginTop: SPACING.md,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: '#EEF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    fontWeight: '500',
    marginTop: 4,
  },
  formCard: { padding: SPACING.xxl },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    marginBottom: SPACING.xxl,
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: { flex: 1 },
  rowGap: { width: SPACING.md },
  selectWrap: { marginBottom: SPACING.lg },
  selectLabel: {
    fontSize: FONT.small,
    fontWeight: '600',
    color: OAK_BRAND.navy,
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  asterisk: { color: OAK_BRAND.error },
  selectButton: {
    backgroundColor: '#EEF0F5',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: {
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '500',
  },
  placeholder: { color: OAK_BRAND.grey },
  selectDropdown: {
    marginTop: 8,
    backgroundColor: OAK_BRAND.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: OAK_BRAND.greyLight,
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: OAK_BRAND.greyLight,
  },
  selectOptionActive: {
    backgroundColor: '#EEF0F5',
  },
  selectOptionText: {
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '500',
  },
  selectOptionTextActive: {
    fontWeight: '700',
  },
  requirementsWrap: {
    backgroundColor: '#EEF0F5',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  requirementsTitle: {
    fontSize: FONT.small,
    fontWeight: '700',
    color: OAK_BRAND.navy,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: OAK_BRAND.greyLight,
    marginBottom: SPACING.xxl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: OAK_BRAND.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
    backgroundColor: OAK_BRAND.white,
  },
  checkboxOn: {
    backgroundColor: OAK_BRAND.navy,
    borderColor: OAK_BRAND.navy,
  },
  checkMark: {
    color: OAK_BRAND.white,
    fontWeight: '800',
    fontSize: 13,
    marginTop: -1,
  },
  consentText: {
    flex: 1,
    color: OAK_BRAND.navy,
    fontSize: FONT.caption,
    lineHeight: 20,
    fontWeight: '500',
  },
  consentLink: {
    color: OAK_BRAND.navy,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  submitButton: { marginBottom: SPACING.xl },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  footerText: {
    flex: 1,
    color: OAK_BRAND.grey,
    fontSize: FONT.small,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
});
