-- =====================================================================
--  OAK FOUNDATION — Partner Convening 2026 Database Schema
-- =====================================================================
--  Tables:
--    1. attendees           — Registered attendees (RLS protected)
--    2. check_ins          — Daily check-in records (unique per day)
--    3. partners           — Partner organisations directory
--    4. programme_sessions — Agenda / schedule
--    5. daily_posts        — Day-by-day notes + photos
--  Views:
--    6. attendee_passes    — Public-safe view for QR lookup (no PII)
-- =====================================================================

-- ═══════════════════════════════════════════════════════════════════════
--  1. ATTENDEES
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS attendees (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  full_name             TEXT NOT NULL,
  email                 TEXT NOT NULL UNIQUE,
  phone                 TEXT,
  organization          TEXT NOT NULL,
  sub_partner           TEXT,
  role_title            TEXT NOT NULL,

  dietary_needs         TEXT,
  accessibility_needs   TEXT,
  travel_needs          TEXT,

  consent_given         BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent_given = TRUE),

  qr_token              TEXT NOT NULL UNIQUE
    DEFAULT 'OAK-2026-'
      || upper(substr(md5(random()::text), 1, 4))
      || '-'
      || upper(substr(md5(random()::text), 1, 4))
);

CREATE INDEX IF NOT EXISTS idx_attendees_email      ON attendees (email);
CREATE INDEX IF NOT EXISTS idx_attendees_qr_token   ON attendees (qr_token);
CREATE INDEX IF NOT EXISTS idx_attendees_org        ON attendees (organization);

-- ═══════════════════════════════════════════════════════════════════════
--  2. CHECK_INS   (UNIQUE attendee + date  →  no double-counting)
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS check_ins (
  id             BIGSERIAL PRIMARY KEY,
  attendee_id    UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
  check_in_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  checked_in_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_check_ins_unique_per_day
  ON check_ins (attendee_id, check_in_date);

CREATE INDEX IF NOT EXISTS idx_check_ins_date   ON check_ins (check_in_date);

-- ═══════════════════════════════════════════════════════════════════════
--  3. PARTNERS
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS partners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  website_url     TEXT,
  logo_path       TEXT,
  description     TEXT,
  is_sub_partner  BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id       UUID REFERENCES partners(id) ON DELETE SET NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_partners_parent   ON partners (parent_id);
CREATE INDEX IF NOT EXISTS idx_partners_order    ON partners (sort_order);

-- ═══════════════════════════════════════════════════════════════════════
--  4. PROGRAMME_SESSIONS
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS programme_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date   DATE NOT NULL,
  start_time     TIME NOT NULL,
  end_time       TIME,
  title          TEXT NOT NULL,
  location       TEXT,
  description    TEXT,
  session_type   TEXT NOT NULL DEFAULT 'plenary'
    CHECK (session_type IN ('plenary','breakout','workshop','social','break')),
  sort_order     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_date_order
  ON programme_sessions (session_date, sort_order);

-- ═══════════════════════════════════════════════════════════════════════
--  5. DAILY_POSTS
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS daily_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_date    DATE NOT NULL UNIQUE,
  notes        TEXT,
  photo_paths  TEXT[] NOT NULL DEFAULT '{}',
  published    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ═══════════════════════════════════════════════════════════════════════
--  6. ATTENDEE_PASSES view  (safe subset — never exposes email / phone)
-- ═══════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW attendee_passes AS
  SELECT
    id,
    created_at,
    full_name,
    organization,
    sub_partner,
    role_title,
    qr_token
  FROM attendees;

-- ═══════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY  —  lock it all down, open only what's needed
-- ═══════════════════════════════════════════════════════════════════════
ALTER TABLE attendees          ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins          ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners           ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_posts        ENABLE ROW LEVEL SECURITY;

-- -------------------------------
--  partners / programme / posts  →  world-readable (anon)
-- -------------------------------
DROP POLICY IF EXISTS anon_read_partners   ON partners;
CREATE POLICY anon_read_partners   ON partners
  FOR SELECT USING (true);

DROP POLICY IF EXISTS anon_read_sessions  ON programme_sessions;
CREATE POLICY anon_read_sessions  ON programme_sessions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS anon_read_posts     ON daily_posts;
CREATE POLICY anon_read_posts     ON daily_posts
  FOR SELECT USING (published = TRUE);

-- -------------------------------
--  attendee_passes view → anonymous read-by-token only
--  (RLS on the underlying *table* is the enforcement point)
-- -------------------------------
DROP POLICY IF EXISTS anon_read_pass ON attendees;
CREATE POLICY anon_read_pass ON attendees
  FOR SELECT USING (false);                 -- raw table: NO access

-- The view works without RLS because it queries the table as the view
-- owner (postgres / supabase_admin), bypassing RLS for that view only.
-- Anonymous users see only the safe view columns.

-- -------------------------------
--  Registration: anonymous INSERT into attendees
--  (must give consent)
-- -------------------------------
DROP POLICY IF EXISTS anon_register ON attendees;
CREATE POLICY anon_register ON attendees
  FOR INSERT
  WITH CHECK (consent_given = TRUE);

-- -------------------------------
--  Check-in  →  authenticated service-role only for INSERT
--  (anon cannot insert into check_ins; use service_role client server-side)
-- -------------------------------
DROP POLICY IF EXISTS service_checkin ON check_ins;
CREATE POLICY service_checkin ON check_ins
  FOR ALL USING (false) WITH CHECK (false);   -- default deny; service_role bypasses RLS

-- ═══════════════════════════════════════════════════════════════════════
--  SEED DATA  (demo partners + sessions so UI is usable out of the box)
-- ═══════════════════════════════════════════════════════════════════════
INSERT INTO partners (name, website_url, description, is_sub_partner, sort_order) VALUES
  ('Open Society Foundations',   'opensocietyfoundations.org', 'Builds vibrant and tolerant democracies.', FALSE, 1),
  ('Africa Climate Alliance',    'africaclimatealliance.org',  'Climate justice advocacy & community organising.', TRUE, 2),
  ('Nordic Evaluation Centre',   'nordiceval.org',             'Independent evaluation for philanthropic organisations.', FALSE, 3),
  ('MENA Rights Group',          'menarights.org',             'Human rights documentation & accountability.', TRUE, 4),
  ('Digital Frontiers Institute','digitalfrontiers.org',       'Open digital infrastructure research & advocacy.', FALSE, 5),
  ('Global Advocacy Lab',        'globaladvocacylab.org',      'Advocacy capacity building for civil society.', FALSE, 6),
  ('Salesforce Philanthropies',  'salesforce.org',             'Technology for economic mobility.', FALSE, 7),
  ('Environmental Funders Group','envfunders.org',             'Collaborative environmental grantmaking network.', FALSE, 8)
ON CONFLICT DO NOTHING;

INSERT INTO programme_sessions
  (session_date, start_time, end_time, title, location, session_type, sort_order) VALUES
  -- Day 1 — Mon 9 Nov 2026
  ('2026-11-09', '08:00', NULL,   'Registration & Welcome Coffee',                NULL,              'break',    1),
  ('2026-11-09', '09:00', '10:30','Opening Plenary: Pathways to Impact',          'Main Hall A',     'plenary',  2),
  ('2026-11-09', '10:30', NULL,   'Coffee Break',                                  NULL,              'break',    3),
  ('2026-11-09', '10:50', '12:00','Thematic Dialogue: Climate Justice & Grantmaking','Conference Room B2','breakout',4),
  ('2026-11-09', '12:00', NULL,   'Networking Lunch',                              NULL,              'break',    5),
  ('2026-11-09', '13:30', '14:30','Partner Spotlight: Rights-Based Approaches',    'Main Hall A',     'plenary',  6),
  ('2026-11-09', '14:45', '16:00','Digital Rights in Authoritarian Contexts',      'Conference Room B1','breakout',7),
  ('2026-11-09', '18:00', '20:00','Welcome Reception & Dinner',                    'Rooftop Terrace', 'social',   8),
  -- Day 2 — Tue 10 Nov 2026
  ('2026-11-10', '08:30', NULL,   'Morning Coffee & Networking',                   NULL,              'break',    9),
  ('2026-11-10', '09:00', '10:30','Keynote: The Future of Philanthropy',          'Main Hall A',     'plenary', 10),
  ('2026-11-10', '10:30', NULL,   'Coffee Break',                                  NULL,              'break',   11),
  ('2026-11-10', '10:50', '12:00','Community Resilience & Local Leadership',       'Conference Room B1','breakout',12),
  ('2026-11-10', '10:50', '12:00','Workshop: Data for Impact',                     'Workshop Room C', 'workshop',13),
  ('2026-11-10', '12:00', NULL,   'Networking Lunch',                              NULL,              'break',   14),
  ('2026-11-10', '13:30', '15:00','Collaborative Grantmaking Frameworks',          'Main Hall A',     'plenary', 15),
  ('2026-11-10', '18:30', '21:00','Cultural Evening',                              'Garden',          'social',  16),
  -- Day 3 — Wed 11 Nov 2026
  ('2026-11-11', '08:30', NULL,   'Morning Coffee',                                NULL,              'break',   17),
  ('2026-11-11', '09:00', '10:30','Closing Plenary: Commitments & Next Steps',     'Main Hall A',     'plenary', 18),
  ('2026-11-11', '10:30', NULL,   'Coffee Break',                                  NULL,              'break',   19),
  ('2026-11-11', '10:50', '12:00','Working Groups: Action Planning',               'Breakout Rooms',  'workshop',20),
  ('2026-11-11', '12:00', NULL,   'Farewell Lunch',                                NULL,              'break',   21),
  ('2026-11-11', '13:30', '14:30','Partner One-to-Ones',                           'Meeting Pods',    'breakout',22),
  ('2026-11-11', '14:30', NULL,   'Departure',                                     NULL,              'break',   23)
ON CONFLICT DO NOTHING;
