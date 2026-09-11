import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star,
  User,
  MapPin,
  ChevronDown,
  FileText,
  Plus,
  StickyNote,
  Images,
  Lightbulb,
  FileDown,
  ExternalLink,
} from 'lucide-react-native';
import OakHeader from '@/components/OakHeader';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { OAK_BRAND, SPACING, FONT, RADIUS } from '@/theme';

type SessionType = 'Plenary' | 'Breakout' | 'Workshop' | 'Social';

type Session = {
  id: string;
  time: string;
  endTime: string;
  title: string;
  type: SessionType;
  featured?: boolean;
  speaker?: string;
  org?: string;
  location?: string;
};

type Day = {
  key: string;
  short: string;
  label: string;
  date: string;
  sessions: Session[];
};

const DAYS: Day[] = [
  {
    key: 'd1',
    short: 'MON',
    label: 'Day 1',
    date: '9 Mar',
    sessions: [
      {
        id: 'f1',
        time: '09:00',
        endTime: '10:30',
        title: 'Opening Plenary: Pathways to Impact',
        type: 'Plenary',
        featured: true,
        speaker: 'Dr. Helena Moreau',
        org: 'OAK Foundation',
        location: 'Main Hall A',
      },
      {
        id: 's1',
        time: '08:00',
        endTime: '09:00',
        title: 'Registration & Welcome Coffee',
        type: 'Breakout',
      },
      {
        id: 's2',
        time: '10:30',
        endTime: '10:50',
        title: 'Coffee Break',
        type: 'Social',
      },
      {
        id: 's3',
        time: '10:50',
        endTime: '12:00',
        title: 'Thematic Dialogue: Climate Justice & Grantmaking',
        type: 'Breakout',
        speaker: 'Samuel Okafor',
        org: 'Africa Climate Alliance',
        location: 'Conference Room B2',
      },
      {
        id: 's4',
        time: '12:00',
        endTime: '13:30',
        title: 'Networking Lunch',
        type: 'Social',
      },
      {
        id: 's5',
        time: '13:30',
        endTime: '14:30',
        title: 'Partner Spotlight: Rights-Based Approaches',
        type: 'Plenary',
        speaker: 'Fatima Zahra Benali',
        org: 'MENA Rights Group',
        location: 'Main Hall A',
      },
      {
        id: 's6',
        time: '14:45',
        endTime: '16:00',
        title: 'Digital Rights in Authoritarian Contexts',
        type: 'Breakout',
        speaker: 'Li Wei',
        org: 'Digital Frontiers Institute',
        location: 'Conference Room B1',
      },
      {
        id: 's7',
        time: '18:00',
        endTime: '20:00',
        title: 'Welcome Reception & Dinner',
        type: 'Social',
        location: 'Rooftop Terrace',
      },
    ],
  },
  {
    key: 'd2',
    short: 'TUE',
    label: 'Day 2',
    date: '10 Mar',
    sessions: [
      {
        id: 'd2-s1',
        time: '09:00',
        endTime: '10:30',
        title: 'Systemic Change & Long-Term Funding',
        type: 'Plenary',
        speaker: 'Dr. Ingrid Holm',
        org: 'Nordic Evaluation Centre',
        location: 'Main Hall A',
      },
      {
        id: 'd2-s2',
        time: '11:00',
        endTime: '12:30',
        title: 'Youth Advocacy Workshop',
        type: 'Workshop',
        speaker: 'Awa Diallo',
        org: 'Geneva Secretariat',
        location: 'Workshop Room C',
      },
      {
        id: 'd2-s3',
        time: '14:00',
        endTime: '15:30',
        title: 'Digital Rights Breakout: Restricted Environments',
        type: 'Breakout',
        speaker: 'Li Wei',
        org: 'Digital Frontiers Institute',
        location: 'Conference Room B1',
      },
    ],
  },
  {
    key: 'd3',
    short: 'WED',
    label: 'Day 3',
    date: '11 Mar',
    sessions: [
      {
        id: 'd3-s1',
        time: '09:00',
        endTime: '10:30',
        title: 'Closing Plenary: Collective Commitments',
        type: 'Plenary',
        speaker: 'Rashida Bello',
        org: 'OAK Foundation',
        location: 'Main Hall A',
      },
      {
        id: 'd3-s2',
        time: '11:00',
        endTime: '12:00',
        title: 'Action Planning Workshops',
        type: 'Workshop',
        location: 'Workshop Rooms A/B/C',
      },
      {
        id: 'd3-s3',
        time: '12:30',
        endTime: '14:00',
        title: 'Closing Lunch & Farewell',
        type: 'Social',
        location: 'Garden Terrace',
      },
    ],
  },
];

const SESSION_TONE: Record<SessionType, 'navy' | 'gold' | 'purple' | 'coral'> = {
  Plenary: 'navy',
  Breakout: 'gold',
  Workshop: 'purple',
  Social: 'coral',
};

const NOTES = [
  {
    id: 'n1',
    author: 'Maria Schmidt',
    org: 'Open Society Foundations',
    avatarVariant: 'navy' as const,
    time: 'Day 1 · 14:32',
    text: 'The rights-based approaches session surfaced strong demand for a shared learning platform. OSF will follow up with MENA Rights Group on joint programming opportunities in the Mediterranean region.',
  },
  {
    id: 'n2',
    author: 'James Odhiambo',
    org: 'OAK Foundation',
    avatarVariant: 'mint' as const,
    time: 'Day 1 · 16:50',
    text: 'Digital Rights breakout: participants want a working group to share tools for operating in restricted digital environments. Interested orgs: Digital Frontiers, Access Now, EFF.',
  },
  {
    id: 'n3',
    author: 'Awa Diallo',
    org: 'Geneva Secretariat',
    avatarVariant: 'gold' as const,
    time: 'Day 2 · 11:15',
    text: "Strategic communications workshop highly rated. Rashida's adaptive messaging framework is directly applicable across 60% of the portfolio. Requesting follow-up toolkit.",
  },
  {
    id: 'n4',
    author: 'Prof. Laurent Weiss',
    org: 'Sciences Po Paris',
    avatarVariant: 'grey' as const,
    time: 'Day 2 · 16:40',
    text: 'Fishbowl revealed consensus: philanthropy needs to accept longer time horizons (10+ years) and better share learning. Key ask: OAK to publish failure cases alongside success stories.',
  },
];

const TAKEAWAYS = [
  'Philanthropy needs to accept 10+ year time horizons for systemic change',
  'Shared learning infrastructure is the most requested resource across the portfolio',
  'Digital rights must be integrated into all programme areas, not siloed',
  'Rights-based framing significantly improves grantee advocacy effectiveness',
  'Peer exchange is rated more valuable than expert-led sessions (92% vs 74%)',
];

const RESOURCES = [
  { id: 'r1', title: 'Opening Plenary Presentation', meta: 'PDF · 3.2 MB · Day 1', type: 'PDF' },
  { id: 'r2', title: 'OAK Portfolio Overview 2024–26', meta: 'PDF · 1.8 MB · Day 2', type: 'PDF' },
  { id: 'r3', title: 'Action Planning Workbook', meta: 'DOCX · 0.9 MB · Day 3', type: 'DOCX' },
  { id: 'r4', title: 'Partner Contact Directory', meta: 'XLSX · 0.4 MB · All Days', type: 'XLSX' },
  { id: 'r5', title: 'Photo Gallery (High Res)', meta: 'ZIP · 184 MB · All Days', type: 'ZIP' },
];

type Tab = 'Schedule' | 'Docs';

export default function ProgrammeScreen() {
  const [tab, setTab] = useState<Tab>('Schedule');
  const [dayKey, setDayKey] = useState(DAYS[0].key);
  const day = DAYS.find((d) => d.key === dayKey)!;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OakHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Programme</Text>
          <Text style={styles.pageSubtitle}>OAK Partner Convening 2026</Text>
        </View>

        <View style={styles.tabBar}>
          {(['Schedule', 'Docs'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              activeOpacity={0.8}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'Schedule' ? (
          <ScheduleView day={day} dayKey={dayKey} setDayKey={setDayKey} />
        ) : (
          <DocsView />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ScheduleView({
  day,
  dayKey,
  setDayKey,
}: {
  day: Day;
  dayKey: string;
  setDayKey: (k: string) => void;
}) {
  const featured = day.sessions.find((s) => s.featured);
  const rest = day.sessions.filter((s) => !s.featured);

  return (
    <View>
      <View style={styles.dayTabs}>
        {DAYS.map((d) => {
          const active = d.key === dayKey;
          return (
            <TouchableOpacity
              key={d.key}
              activeOpacity={0.8}
              onPress={() => setDayKey(d.key)}
              style={[styles.dayTab, active && styles.dayTabActive]}
            >
              <Text style={[styles.dayShort, active && styles.dayShortActive]}>{d.short}</Text>
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{d.label}</Text>
              <Text style={[styles.dayDate, active && styles.dayDateActive]}>{d.date}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {featured && (
        <Card variant="dark" style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <View style={styles.featuredStar}>
              <Star size={14} color={OAK_BRAND.gold} fill={OAK_BRAND.gold} />
            </View>
            <Text style={styles.featuredTag}>FEATURED</Text>
            <Text style={styles.featuredTime}>
              {featured.time} - {featured.endTime}
            </Text>
          </View>
          <Text style={styles.featuredTitle}>{featured.title}</Text>
          {featured.speaker && (
            <View style={styles.featuredMeta}>
              <View style={styles.metaBadge}>
                <User size={14} color="rgba(255,255,255,0.55)" strokeWidth={2} />
              </View>
              <Text style={styles.featuredMetaText}>
                {featured.speaker}{featured.org ? ` · ${featured.org}` : ''}
              </Text>
            </View>
          )}
          {featured.location && (
            <View style={styles.featuredMeta}>
              <View style={styles.metaBadge}>
                <MapPin size={14} color="rgba(255,255,255,0.55)" strokeWidth={2} />
              </View>
              <Text style={styles.featuredMetaText}>{featured.location}</Text>
            </View>
          )}
        </Card>
      )}

      <View style={styles.legendRow}>
        {(['Plenary', 'Breakout', 'Workshop', 'Social'] as SessionType[]).map((t) => (
          <View key={t} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: dotColor(t) }]} />
            <Text style={styles.legendText}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={styles.timeline}>
        {rest.map((s) => (
          <SessionCard key={s.id} session={s} />
        ))}
      </View>
    </View>
  );
}

function dotColor(t: SessionType) {
  switch (t) {
    case 'Plenary':
      return OAK_BRAND.navy;
    case 'Breakout':
      return OAK_BRAND.gold;
    case 'Workshop':
      return '#8B5CF6';
    case 'Social':
      return '#F97316';
  }
}

function SessionCard({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const isBlock = session.speaker || session.location;
  const showCard = isBlock || session.type !== 'Breakout' || open;

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timeCol}>
        <Text style={styles.timeText}>{session.time}</Text>
        {session.endTime && (
          <Text style={styles.endTimeText}>-{session.endTime}</Text>
        )}
      </View>
      <View style={styles.trackCol}>
        <View style={styles.dotWrap}>
          <View style={[styles.timelineDot, { backgroundColor: dotColor(session.type) }]} />
        </View>
        {!isBlock ? (
          <Text style={styles.breakText}>{session.title}</Text>
        ) : (
          <Card padding={0} style={styles.sessionCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOpen((v) => !v)}
              style={styles.sessionInner}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
              </View>
              <Tag label={session.type} tone={SESSION_TONE[session.type]} dot />
              <ChevronDown
                size={18}
                color={OAK_BRAND.grey}
                style={{ marginLeft: 8, transform: [{ rotate: open ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
            {open && (
              <View style={styles.sessionExpand}>
                {session.speaker && (
                  <View style={styles.sessionMetaRow}>
                    <View style={styles.sessionMetaBadge}>
                      <User size={14} color={OAK_BRAND.grey} strokeWidth={2} />
                    </View>
                    <Text style={styles.sessionMetaText}>
                      {session.speaker}{session.org ? ` · ${session.org}` : ''}
                    </Text>
                  </View>
                )}
                {session.location && (
                  <View style={styles.sessionMetaRow}>
                    <View style={styles.sessionMetaBadge}>
                      <MapPin size={14} color={OAK_BRAND.grey} strokeWidth={2} />
                    </View>
                    <Text style={styles.sessionMetaText}>{session.location}</Text>
                  </View>
                )}
              </View>
            )}
          </Card>
        )}
      </View>
    </View>
  );
}

function DocsView() {
  return (
    <View>
      <View style={styles.docsHeader}>
        <View style={styles.docsHeaderLeft}>
          <StickyNote size={20} color={OAK_BRAND.navy} strokeWidth={2} />
          <Text style={styles.docsSectionTitle}>Session Notes</Text>
        </View>
        <Button
          title="Add Note"
          size="md"
          icon={<Plus size={16} color={OAK_BRAND.white} strokeWidth={2.5} />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.notesList}>
        {NOTES.map((n) => (
          <Card key={n.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Avatar name={n.author} size={40} variant={n.avatarVariant} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.noteAuthor}>{n.author}</Text>
                <Text style={styles.noteOrg}>{n.org}</Text>
              </View>
              <View style={styles.noteTimeBadge}>
                <Text style={styles.noteTime}>{n.time}</Text>
              </View>
            </View>
            <Text style={styles.noteText}>{n.text}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.docsHeader}>
        <View style={styles.docsHeaderLeft}>
          <Images size={20} color={OAK_BRAND.navy} strokeWidth={2} />
          <Text style={styles.docsSectionTitle}>Photo Gallery</Text>
        </View>
        <Text style={styles.galleryCount}>6 photos</Text>
      </View>

      <View style={styles.galleryGrid}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const img = galleryImg(i);
          return (
            <View key={i} style={styles.galleryItem}>
              <Image source={{ uri: img }} style={styles.galleryImg} />
            </View>
          );
        })}
      </View>

      <View style={styles.docsHeader}>
        <View style={styles.docsHeaderLeft}>
          <Lightbulb size={20} color={OAK_BRAND.navy} strokeWidth={2} />
          <Text style={styles.docsSectionTitle}>Key Takeaways</Text>
        </View>
      </View>

      <Card style={styles.takeawayCard}>
        {TAKEAWAYS.map((t, i) => (
          <View key={t} style={styles.takeawayItem}>
            <View style={styles.takeawayNum}>
              <Text style={styles.takeawayNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.takeawayText}>{t}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.docsHeader}>
        <View style={styles.docsHeaderLeft}>
          <FileDown size={20} color={OAK_BRAND.navy} strokeWidth={2} />
          <Text style={styles.docsSectionTitle}>Resources</Text>
        </View>
      </View>

      <View style={styles.resourcesList}>
        {RESOURCES.map((r) => (
          <Card key={r.id} style={styles.resourceCard}>
            <View style={styles.resourceIcon}>
              <FileText size={22} color={OAK_BRAND.navy} strokeWidth={2} />
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.resourceTitle}>{r.title}</Text>
              <Text style={styles.resourceMeta}>{r.meta}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
              <ExternalLink size={18} color={OAK_BRAND.grey} strokeWidth={2} />
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    </View>
  );
}

function galleryImg(i: number) {
  const prompts = [
    'conference%20audience%20plenary%20hall',
    'keynote%20speaker%20stage%20event',
    'workshop%20discussion%20roundtable',
    'empty%20meeting%20room%20conference',
    'conference%20networking%20reception%20coffee',
    'business%20travel%20attendee%20conference%20bag',
  ];
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${prompts[i % prompts.length]}&image_size=square`;
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
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E6E8EE',
    padding: 4,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.lg - 2,
  },
  tabActive: {
    backgroundColor: OAK_BRAND.white,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '600',
  },
  tabTextActive: {
    color: OAK_BRAND.navy,
    fontWeight: '700',
  },
  dayTabs: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  dayTab: {
    flex: 1,
    backgroundColor: OAK_BRAND.white,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: OAK_BRAND.greyLight,
  },
  dayTabActive: {
    backgroundColor: OAK_BRAND.navy,
    borderColor: OAK_BRAND.navy,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  dayShort: {
    fontSize: 11,
    fontWeight: '700',
    color: OAK_BRAND.grey,
    letterSpacing: 1.2,
  },
  dayShortActive: { color: 'rgba(255,255,255,0.7)' },
  dayLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    marginTop: 2,
  },
  dayLabelActive: { color: OAK_BRAND.white },
  dayDate: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    marginTop: 2,
    fontWeight: '500',
  },
  dayDateActive: { color: 'rgba(255,255,255,0.75)' },
  featuredCard: {
    marginBottom: SPACING.xl,
    padding: SPACING.xxl,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featuredStar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: OAK_BRAND.gold + '33',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  featuredTag: {
    color: OAK_BRAND.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginRight: 'auto',
  },
  featuredTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT.caption,
    fontWeight: '600',
  },
  featuredTitle: {
    color: OAK_BRAND.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 30,
    marginBottom: SPACING.lg,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  metaBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  featuredMetaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT.body,
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    marginBottom: SPACING.lg + 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  timeline: {
    marginTop: SPACING.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timeCol: {
    width: 72,
    paddingTop: 6,
  },
  timeText: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: OAK_BRAND.navy,
  },
  endTimeText: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    marginTop: 2,
    fontWeight: '500',
  },
  trackCol: {
    flex: 1,
    flexDirection: 'row',
  },
  dotWrap: {
    width: 28,
    alignItems: 'center',
    paddingTop: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakText: {
    flex: 1,
    fontSize: FONT.body,
    color: OAK_BRAND.grey,
    fontWeight: '500',
    paddingTop: 4,
  },
  sessionCard: {
    flex: 1,
    overflow: 'hidden',
  },
  sessionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  sessionTitle: {
    fontSize: FONT.h3,
    fontWeight: '700',
    color: OAK_BRAND.navy,
    paddingRight: SPACING.sm,
    lineHeight: 24,
  },
  sessionExpand: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: OAK_BRAND.greyLight,
    paddingTop: SPACING.md,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionMetaBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#F2F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sessionMetaText: {
    fontSize: FONT.caption,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  docsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  docsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docsSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: OAK_BRAND.navy,
    letterSpacing: -0.2,
    marginLeft: SPACING.sm,
  },
  galleryCount: {
    fontSize: FONT.caption,
    color: OAK_BRAND.grey,
    fontWeight: '500',
  },
  notesList: { gap: SPACING.md },
  noteCard: { padding: SPACING.lg },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  noteAuthor: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: OAK_BRAND.navy,
  },
  noteOrg: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    marginTop: 2,
    fontWeight: '500',
  },
  noteTimeBadge: {
    backgroundColor: '#EEF0F5',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  noteTime: {
    fontSize: 11,
    color: OAK_BRAND.grey,
    fontWeight: '600',
  },
  noteText: {
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '500',
    lineHeight: 22,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  galleryItem: {
    width: '50%',
    aspectRatio: 1,
    padding: 4,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
    backgroundColor: '#EEF0F5',
  },
  takeawayCard: {
    padding: SPACING.lg,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
  },
  takeawayNum: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: OAK_BRAND.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  takeawayNumText: {
    color: OAK_BRAND.white,
    fontWeight: '800',
    fontSize: FONT.caption,
  },
  takeawayText: {
    flex: 1,
    fontSize: FONT.body,
    color: OAK_BRAND.navy,
    fontWeight: '500',
    lineHeight: 22,
  },
  resourcesList: { gap: SPACING.md },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitle: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: OAK_BRAND.navy,
  },
  resourceMeta: {
    fontSize: FONT.small,
    color: OAK_BRAND.grey,
    marginTop: 2,
    fontWeight: '500',
  },
});
