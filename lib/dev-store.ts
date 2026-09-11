import fs from "fs";
import path from "path";
import type { AttendeeAdmin } from "@/lib/types";

// Seed attendees for dev testing
const DEFAULT_ATTENDEES: AttendeeAdmin[] = [
  {
    id: "demo-1",
    full_name: "Collin Manyande",
    email: "collin@opensociety.org",
    phone: "+263 77 123 4567",
    organization: "Open Society Foundations",
    sub_partner: null,
    role_title: "Partner",
    dietary_needs: "None",
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: "OAK-2026-7842-XXPH",
  },
  {
    id: "demo-2",
    full_name: "James Odhiambo",
    email: "james@oakfound.org",
    phone: "+254 71 234 5678",
    organization: "OAK Foundation",
    sub_partner: null,
    role_title: "OAK Staff",
    dietary_needs: "Vegetarian",
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: "OAK-2026-1193-JWQA",
  },
  {
    id: "demo-3",
    full_name: "Awa Diallo",
    email: "awa.diallo@salesforce.org",
    phone: "+221 77 654 3210",
    organization: "Salesforce Philanthropies",
    sub_partner: null,
    role_title: "Coordination Team",
    dietary_needs: "Halal",
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: "OAK-2026-2034-MBU",
  },
  {
    id: "demo-4",
    full_name: "Kayden Mamu",
    email: "kayden@envfunders.org",
    phone: "+27 82 345 6789",
    organization: "Environmental Funders Group",
    sub_partner: null,
    role_title: "Partner",
    dietary_needs: null,
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: "OAK-2026-5592-FWBN",
  },
  {
    id: "demo-5",
    full_name: "Maria Schmidt",
    email: "maria.schmidt@opensociety.org",
    phone: "+49 170 1234567",
    organization: "Open Society Foundations",
    sub_partner: null,
    role_title: "Presenter",
    dietary_needs: "Gluten-free",
    accessibility_needs: null,
    travel_needs: null,
    consent_given: true,
    qr_token: "OAK-2026-8821-PQMS",
  },
];

interface DevStoreData {
  attendees: AttendeeAdmin[];
  checkIns: {
    id: string;
    attendee_id: string;
    check_in_date: string;
    checked_in_at: string;
  }[];
}

const STORE_PATH = path.join(process.cwd(), ".next", "oak_dev_store.json");

function readStore(): DevStoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[dev-store] Read error:", err);
  }
  return {
    attendees: [...DEFAULT_ATTENDEES],
    checkIns: [],
  };
}

function writeStore(data: DevStoreData) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[dev-store] Write error:", err);
  }
}

export function saveDevAttendee(attendee: AttendeeAdmin): AttendeeAdmin {
  const store = readStore();
  const existingIndex = store.attendees.findIndex(
    (a) => a.email.toLowerCase() === attendee.email.toLowerCase()
  );
  if (existingIndex >= 0) {
    store.attendees[existingIndex] = attendee;
  } else {
    store.attendees.push(attendee);
  }
  writeStore(store);
  return attendee;
}

export function getDevAttendeeByToken(token: string): AttendeeAdmin | undefined {
  const store = readStore();
  const clean = token.trim().toLowerCase();
  return store.attendees.find((a) => a.qr_token.toLowerCase() === clean);
}

export function getDevAttendeeByEmail(email: string): AttendeeAdmin | undefined {
  const store = readStore();
  const clean = email.trim().toLowerCase();
  return store.attendees.find((a) => a.email.toLowerCase() === clean);
}

export function getAllDevAttendees(): AttendeeAdmin[] {
  const store = readStore();
  return store.attendees;
}

export function recordDevCheckIn(
  attendeeId: string,
  date: string = new Date().toISOString().slice(0, 10)
): {
  status: "success" | "already_checked_in";
  checkInDate: string;
  checkedInAt: string;
} {
  const store = readStore();
  const existing = store.checkIns.find(
    (c) => c.attendee_id === attendeeId && c.check_in_date === date
  );
  if (existing) {
    return {
      status: "already_checked_in",
      checkInDate: existing.check_in_date,
      checkedInAt: existing.checked_in_at,
    };
  }

  const newCheckIn = {
    id: "ci-" + Math.random().toString(36).substring(2, 9),
    attendee_id: attendeeId,
    check_in_date: date,
    checked_in_at: new Date().toISOString(),
  };

  store.checkIns.push(newCheckIn);
  writeStore(store);

  return {
    status: "success",
    checkInDate: newCheckIn.check_in_date,
    checkedInAt: newCheckIn.checked_in_at,
  };
}

export function getDevCheckIns(): {
  check_in_date: string;
  checked_in_at: string;
  attendee: AttendeeAdmin;
}[] {
  const store = readStore();
  return store.checkIns
    .map((c) => {
      const attendee = store.attendees.find((a) => a.id === c.attendee_id);
      if (!attendee) return null;
      return {
        check_in_date: c.check_in_date,
        checked_in_at: c.checked_in_at,
        attendee,
      };
    })
    .filter(Boolean) as {
    check_in_date: string;
    checked_in_at: string;
    attendee: AttendeeAdmin;
  }[];
}
