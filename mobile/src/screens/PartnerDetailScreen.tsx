import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe2, ExternalLink, Mail, ChevronRight } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { PartnersStackParamList } from '@/navigation/types';
import { getInitials } from '@/utils/format';

type Route = RouteProp<PartnersStackParamList, 'PartnerDetail'>;

export default function PartnerDetailScreen() {
  const route = useRoute<Route>();
  const { partner } = route.params;
  const p = partner as any;

  const handleWebsite = () => {
    if (p.website_url && Linking.openURL(`https://${p.website_url}`));
  };

  const initials = getInitials(p.name ?? '');

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
          style={styles.heroCard}
        >
          <View style={styles.heroInner}>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.lg }}>
              <Text style={styles.heroEyebrow}>
                FOUNDATION · PARTNER SINCE {p.partner_since ?? '—'}
              </Text>
              <Text style={styles.heroName}>{p.name}</Text>
              <View style={styles.heroTags}>
                {(p.tags ?? []).map((t: any) => (
                  <View key={t.label} style={styles.heroTagPill}>
                    <Text style={styles.heroTagText}>{t.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>

        <Card style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.aboutText}>
            {p.description ??
              `${p.name} partners with OAK Foundation to advance shared goals across the ${p.region ?? 'global'} portfolio.`}
          </Text>
        </Card>

        <Card style={styles.contactCard}>
          <Text style={styles.sectionTitle}>CONTACT AT CONVENING</Text>
          <View style={styles.contactRow}>
            <Avatar name="Maria Schmidt" size={52} variant="navy" />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.contactName}>Maria Schmidt</Text>
              <Text style={styles.contactEmail}>m.schmidt@osf.org</Text>
            </View>
          </View>
        </Card>

        <Button
          title="Visit Website"
          icon={<Globe2 size={20} color={OAK_BRAND.white} strokeWidth={2.2} />}
          iconRight={<ExternalLink size={18} color={OAK_BRAND.white} strokeWidth={2} />}
          onPress={handleWebsite}
          style={styles.primaryBtn}
        />
        <Button
          title="Send Message"
          variant="secondary"
          icon={<Mail size={20} color={OAK_BRAND.navy} strokeWidth={2.2} />}
          iconRight={<ChevronRight size={18} color={OAK_BRAND.grey} />}
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
  heroCard: {
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 6,
  },
  heroInner: {
    padding: SPACING.xxl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroAvatar: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroAvatarText: {
    color: OAK_BRAND.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroName: {
    color: OAK_BRAND.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  heroTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: 8,
  },
  heroTagPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  heroTagText: {
    color: OAK_BRAND.white,
    fontSize: FONT.small,
    fontWeight: '600',
  },
  aboutCard: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1.6,
    marginBottom: SPACING.md,
  },
  aboutText: {
    fontSize: FONT.h3,
    color: OAK_BRAND.navy,
    lineHeight: 26,
    fontWeight: '500',
  },
  contactCard: {
    marginBottom: SPACING.xxl,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 20,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.2,
  },
  contactEmail: {
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    marginTop: 3,
    fontWeight: '500',
  },
  primaryBtn: {
    marginBottom: SPACING.md,
  },
  secondaryBtn: {},
});
