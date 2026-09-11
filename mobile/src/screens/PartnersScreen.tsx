import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, ExternalLink } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import Avatar from '@/components/Avatar';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';
import { PartnersStackParamList } from '@/navigation/types';
import type { Partner } from '@/types';
import { getInitials } from '@/utils/format';

type Nav = NativeStackNavigationProp<PartnersStackParamList, 'PartnersList'>;

type TagTone = 'default' | 'mint' | 'lilac' | 'peach' | 'gold' | 'blue' | 'navy' | 'green' | 'purple' | 'coral';

type PartnerExt = Partner & {
  region: string;
  tags: { label: string; tone: TagTone }[];
  partner_since?: string;
  is_sub: boolean;
};

const REGIONS = ['All Regions', 'Global', 'Sub-Saharan Africa', 'Northern Europe', 'Middle East & North Africa', 'Western Europe', 'Europe'];

const PARTNERS: PartnerExt[] = [
  {
    id: 'osf',
    name: 'Open Society Foundations',
    website_url: 'opensocietyfoundations.org',
    logo_path: null,
    description:
      'Open Society Foundations builds vibrant and tolerant democracies. OAK partnership covers digital rights and justice initiatives across Eastern Europe and Central Asia.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 1,
    region: 'Global',
    tags: [
      { label: 'Foundation', tone: 'lilac' },
      { label: 'Democracy', tone: 'blue' },
      { label: 'Human Rights', tone: 'blue' },
    ],
    partner_since: '2018',
    is_sub: false,
  },
  {
    id: 'aca',
    name: 'Africa Climate Alliance',
    website_url: 'africaclimatealliance.org',
    logo_path: null,
    description:
      'African-led alliance advancing climate justice and community resilience across the continent.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 2,
    region: 'Sub-Saharan Africa',
    tags: [
      { label: 'NGO', tone: 'mint' },
      { label: 'Climate Justice', tone: 'green' },
      { label: 'Youth Advocacy', tone: 'peach' },
    ],
    partner_since: '2020',
    is_sub: false,
  },
  {
    id: 'nec',
    name: 'Nordic Evaluation Centre',
    website_url: 'nordicevaluation.org',
    logo_path: null,
    description:
      'Independent research centre providing rigorous evaluation and learning across the Nordic philanthropic ecosystem.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 3,
    region: 'Northern Europe',
    tags: [
      { label: 'Research', tone: 'lilac' },
      { label: 'Evaluation', tone: 'blue' },
      { label: 'Learning', tone: 'default' },
    ],
    partner_since: '2021',
    is_sub: false,
  },
  {
    id: 'mrg',
    name: 'MENA Rights Group',
    website_url: 'menarights.org',
    logo_path: null,
    description:
      'Regional organisation documenting and advocating for human rights across the Middle East and North Africa.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 4,
    region: 'Middle East & North Africa',
    tags: [
      { label: 'NGO', tone: 'mint' },
      { label: 'Human Rights', tone: 'blue' },
      { label: 'Documentation', tone: 'default' },
    ],
    partner_since: '2019',
    is_sub: false,
  },
  {
    id: 'dfi',
    name: 'Digital Frontiers Institute',
    website_url: 'digitalfrontiers.org',
    logo_path: null,
    description:
      'Research and action institute defending digital rights in restrictive and emerging contexts.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 5,
    region: 'Global / East Africa',
    tags: [
      { label: 'Research', tone: 'lilac' },
      { label: 'Digital Rights', tone: 'navy' },
      { label: 'Internet Freedom', tone: 'default' },
    ],
    partner_since: '2022',
    is_sub: false,
  },
  {
    id: 'gal',
    name: 'Global Advocacy Lab',
    website_url: 'globaladvocacylab.org',
    logo_path: null,
    description: 'Communications and campaigning agency for impact-driven organisations.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 6,
    region: 'Global',
    tags: [
      { label: 'NGO', tone: 'mint' },
      { label: 'Communications', tone: 'purple' },
      { label: 'Campaigns', tone: 'coral' },
    ],
    partner_since: '2023',
    is_sub: false,
  },
  {
    id: 'sp',
    name: 'Sciences Po Paris',
    website_url: 'sciencespo.fr',
    logo_path: null,
    description: 'Leading European research university partnering on policy, social sciences, and civic education.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 7,
    region: 'Western Europe',
    tags: [
      { label: 'Academic', tone: 'lilac' },
      { label: 'Research', tone: 'blue' },
      { label: 'Policy', tone: 'navy' },
    ],
    partner_since: '2020',
    is_sub: false,
  },
  {
    id: 'efg',
    name: 'Environmental Funders Group',
    website_url: 'envfunders.eu',
    logo_path: null,
    description:
      'Network of European environmental funders coordinating on climate and nature strategies.',
    is_sub_partner: false,
    parent_id: null,
    sort_order: 8,
    region: 'Europe',
    tags: [
      { label: 'Network', tone: 'peach' },
      { label: 'Environment', tone: 'green' },
      { label: 'Climate', tone: 'gold' },
    ],
    partner_since: '2017',
    is_sub: false,
  },
];

const SUB_PARTNERS = [
  { id: 'sub-osf', name: 'OSF', region: 'Global', tone: 'navy' as TagTone },
  { id: 'sub-aca', name: 'ACA', region: 'Sub-Saharan Africa', tone: 'navy' as TagTone },
  { id: 'sub-nec', name: 'NEC', region: 'Northern Europe', tone: 'navy' as TagTone },
];

export default function PartnersScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState(REGIONS[0]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PARTNERS.filter((p) => {
      const matchQ =
      !q ||
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.tags.some((t) => t.label.toLowerCase().includes(q));
      const matchR = region === REGIONS[0] || p.region.includes(region.replace(/^All /, '').trim());
      return matchQ && matchR;
    });
  }, [query, region]);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Partner Directory</Text>

        <Card padding={SPACING.md} style={styles.searchCard}>
          <View style={styles.searchRow}>
            <View style={styles.searchIconWrap}>
              <Search size={18} color={OAK_BRAND.grey} strokeWidth={2} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search organisations, focus areas..."
              placeholderTextColor={OAK_BRAND.grey}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionRow}
          >
            {REGIONS.map((r) => {
              const active = r === region;
              return (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.7}
                  onPress={() => setRegion(r)}
                  style={[styles.regionChip, active && styles.regionChipActive]}
                >
                  <Text style={[styles.regionText, active && styles.regionTextActive]}>{r}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Card>

        <Text style={styles.sectionLabel}>SUB-PARTNERS</Text>
        <View style={styles.subRow}>
          {SUB_PARTNERS.map((s) => (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.7}
              onPress={() => {}}
              style={styles.subCard}
            >
              <View style={styles.subAvatar}>
                <Text style={styles.subAvatarText}>{s.name}</Text>
              </View>
              <Text style={styles.subName}>{s.name}</Text>
              <Text style={styles.subRegion}>{s.region}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.xl }]}>ALL PARTNERS</Text>

        <View style={styles.listGap}>
          {filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('PartnerDetail', { partner: p })}
            >
              <Card padding={SPACING.lg} style={styles.listCard}>
                <View style={styles.cardTop}>
                  <View style={styles.partnerAvatar}>
                    <Text style={styles.partnerAvatarText}>{getInitials(p.name)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.partnerName}>{p.name}</Text>
                    <Text style={styles.partnerRegion}>{p.region}</Text>
                    <View style={styles.tagRow}>
                      {p.tags.map((t) => (
                        <Tag key={t.label} label={t.label} tone={t.tone} />
                      ))}
                    </View>
                  </View>
                  <ChevronRight size={18} color={OAK_BRAND.grey} />
                </View>
                <View style={styles.cardFooter}>
                  {p.partner_since && (
                    <Text style={styles.footerItem}>Partner since {p.partner_since}</Text>
                  )}
                  <View style={{ flex: 1 }} />
                  {p.website_url && (
                    <View style={styles.websiteRow}>
                      <Text style={[styles.footerItem, styles.footerLink]}>{p.website_url}</Text>
                      <ExternalLink size={14} color={OAK_BRAND.navy} style={{ marginLeft: 4 }} />
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: OAK_BRAND.offWhite },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl * 2 },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.6,
    marginBottom: SPACING.xl,
  },
  searchCard: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF0F5',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 52,
    marginBottom: SPACING.md,
  },
  searchIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '500',
  },
  regionRow: {
    gap: 8,
    paddingVertical: 2,
  },
  regionChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: OAK_BRAND.offWhite,
    borderWidth: 1,
    borderColor: OAK_BRAND.greyLight,
    marginRight: 8,
  },
  regionChipActive: {
    backgroundColor: OAK_BRAND.navy,
    borderColor: OAK_BRAND.navy,
  },
  regionText: {
    fontSize: FONT.caption,
    color: OAK_BRAND.navy,
    fontWeight: '600',
  },
  regionTextActive: {
    color: OAK_BRAND.white,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  subRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  subCard: {
    flex: 1,
    backgroundColor: OAK_BRAND.white,
    borderRadius: RADIUS.xl,
    marginHorizontal: 4,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  subAvatar: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: OAK_BRAND.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  subAvatarText: {
    color: OAK_BRAND.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subName: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: OAK_BRAND.navy,
    marginBottom: 4,
  },
  subRegion: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    fontWeight: '500',
    textAlign: 'center',
  },
  listGap: {
    gap: SPACING.md,
  },
  listCard: {
    padding: SPACING.xl,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  partnerAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: OAK_BRAND.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerAvatarText: {
    color: OAK_BRAND.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    marginBottom: 3,
  },
  partnerRegion: {
    fontSize: FONT.caption,
    color: OAK_BRAND.grey,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: OAK_BRAND.greyLight,
  },
  footerItem: {
    fontSize: FONT.caption,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  footerLink: {
    color: OAK_BRAND.navy,
    fontWeight: '600',
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
