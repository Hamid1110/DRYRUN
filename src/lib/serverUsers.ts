import fs from 'fs';
import path from 'path';

export interface ServerUserRecord {
  id: string;
  name: string;
  institute?: string;
  xp: number;
  streakDays: number;
  levelsDone: number;
  lastActiveAt: number;
  firstSeenAt: number;
}

export interface CommunityResponse {
  totalVisited: number;
  onlineCount: number;
  regularCount: number;
  users: Array<ServerUserRecord & { isOnline: boolean; isRegular: boolean }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// In-memory cache for fast concurrent requests
let memoryUsers: Map<string, ServerUserRecord> | null = null;

// Initial starter seed to make the community vibrant on first launch
const SEED_USERS: ServerUserRecord[] = [
  {
    id: 'seed_fast_1',
    name: 'Hamza Tariq',
    institute: 'FAST NUCES Islamabad',
    xp: 680,
    streakDays: 6,
    levelsDone: 14,
    lastActiveAt: Date.now() - 2 * 60 * 1000, // 2m ago (online)
    firstSeenAt: Date.now() - 7 * 86400 * 1000,
  },
  {
    id: 'seed_nust_2',
    name: 'Ayesha Noor',
    institute: 'NUST SEECS',
    xp: 590,
    streakDays: 5,
    levelsDone: 12,
    lastActiveAt: Date.now() - 1 * 60 * 1000, // 1m ago (online)
    firstSeenAt: Date.now() - 6 * 86400 * 1000,
  },
  {
    id: 'seed_giki_3',
    name: 'Bilal Ahmed',
    institute: 'GIKI Swabi',
    xp: 450,
    streakDays: 4,
    levelsDone: 9,
    lastActiveAt: Date.now() - 14 * 60 * 1000, // 14m ago
    firstSeenAt: Date.now() - 5 * 86400 * 1000,
  },
  {
    id: 'seed_comsats_4',
    name: 'Zainab Fatima',
    institute: 'COMSATS Lahore',
    xp: 380,
    streakDays: 3,
    levelsDone: 8,
    lastActiveAt: Date.now() - 42 * 60 * 1000, // 42m ago
    firstSeenAt: Date.now() - 4 * 86400 * 1000,
  },
  {
    id: 'seed_uet_5',
    name: 'Usman Ali',
    institute: 'UET Taxila',
    xp: 320,
    streakDays: 3,
    levelsDone: 7,
    lastActiveAt: Date.now() - 3 * 3600 * 1000, // 3h ago
    firstSeenAt: Date.now() - 3 * 86400 * 1000,
  },
  {
    id: 'seed_fast_6',
    name: 'Saad Malik',
    institute: 'FAST NUCES Lahore',
    xp: 260,
    streakDays: 2,
    levelsDone: 5,
    lastActiveAt: Date.now() - 5 * 3600 * 1000, // 5h ago
    firstSeenAt: Date.now() - 3 * 86400 * 1000,
  },
];

function initStorage(): Map<string, ServerUserRecord> {
  if (memoryUsers) return memoryUsers;
  memoryUsers = new Map<string, ServerUserRecord>();

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const list: ServerUserRecord[] = JSON.parse(raw);
      for (const u of list) {
        memoryUsers.set(u.id, u);
      }
    } else {
      // Seed initial users
      for (const u of SEED_USERS) {
        memoryUsers.set(u.id, u);
      }
      persistSync();
    }
  } catch (err) {
    console.error('Error initializing users data storage:', err);
    for (const u of SEED_USERS) {
      memoryUsers.set(u.id, u);
    }
  }
  return memoryUsers;
}

let saveTimeout: NodeJS.Timeout | null = null;
function schedulePersist() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    persistSync();
  }, 1000);
}

function persistSync() {
  if (!memoryUsers) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const arr = Array.from(memoryUsers.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting users data file:', err);
  }
}

export function recordUserHeartbeat(payload: {
  id: string;
  name: string;
  institute?: string;
  xp?: number;
  streakDays?: number;
  levelsDone?: number;
}): ServerUserRecord {
  const store = initStorage();
  const existing = store.get(payload.id);
  const now = Date.now();

  const record: ServerUserRecord = {
    id: payload.id,
    name: payload.name.trim() || existing?.name || 'Learner ' + payload.id.slice(-4).toUpperCase(),
    institute: payload.institute?.trim() || existing?.institute || '',
    xp: Math.max(payload.xp ?? 0, existing?.xp ?? 0),
    streakDays: Math.max(payload.streakDays ?? 0, existing?.streakDays ?? 0),
    levelsDone: Math.max(payload.levelsDone ?? 0, existing?.levelsDone ?? 0),
    lastActiveAt: now,
    firstSeenAt: existing?.firstSeenAt ?? now,
  };

  store.set(payload.id, record);
  schedulePersist();
  return record;
}

export function getCommunityData(): CommunityResponse {
  const store = initStorage();
  const now = Date.now();
  const ONLINE_WINDOW_MS = 4 * 60 * 1000; // active in last 4 mins

  let onlineCount = 0;
  let regularCount = 0;

  const userList: Array<ServerUserRecord & { isOnline: boolean; isRegular: boolean }> = [];

  for (const u of store.values()) {
    const isOnline = now - u.lastActiveAt < ONLINE_WINDOW_MS;
    const isRegular = u.streakDays >= 2 || u.levelsDone >= 3 || u.xp >= 150;

    if (isOnline) onlineCount++;
    if (isRegular) regularCount++;

    userList.push({
      ...u,
      isOnline,
      isRegular,
    });
  }

  // Sort: online users first, then by XP points desc, then streak days desc
  userList.sort((a, b) => {
    if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
    if (b.xp !== a.xp) return b.xp - a.xp;
    if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
    return b.lastActiveAt - a.lastActiveAt;
  });

  return {
    totalVisited: store.size,
    onlineCount,
    regularCount,
    users: userList,
  };
}
