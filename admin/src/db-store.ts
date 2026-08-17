import fs from "fs";
import path from "path";
import pg from "pg";
import type {
  ActivityLog,
  Batch,
  Course,
  Inquiry,
  Payment,
  Settings,
  Student,
  Teacher,
  User,
} from "./types";

export type AdminDatabase = {
  users: User[];
  courses: Course[];
  batches: Batch[];
  students: Student[];
  inquiries: Inquiry[];
  payments: Payment[];
  logs: ActivityLog[];
  settings: Settings;
  teachers: Teacher[];
};

const { Pool } = pg;

let pool: pg.Pool | null = null;
let cache: AdminDatabase | null = null;
let writeChain: Promise<void> = Promise.resolve();
let initPromise: Promise<void> | null = null;

function requireCache(): AdminDatabase {
  if (!cache) {
    throw new Error("Admin database is not initialized.");
  }
  return cache;
}

function loadEnvFallback() {
  if (process.env.DATABASE_URL?.trim()) return;
  try {
    const file = path.join(process.cwd(), "admin/.env");
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

function connectionString(): string {
  loadEnvFallback();
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error("DATABASE_URL is missing. Add the Neon connection string in Vercel env or admin/.env");
  }
  const unquoted = raw.replace(/^["']|["']$/g, "");
  const url = new URL(unquoted);
  url.searchParams.delete("channel_binding");
  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }
  return url.toString();
}

async function persist(): Promise<void> {
  if (!pool || !cache) return;
  await pool.query(
    `INSERT INTO admin_store (id, payload, updated_at)
     VALUES (1, $1::jsonb, now())
     ON CONFLICT (id) DO UPDATE
     SET payload = EXCLUDED.payload, updated_at = now()`,
    [JSON.stringify(cache)],
  );
}

export function readDB(): AdminDatabase {
  return requireCache();
}

export function writeDB(data: AdminDatabase) {
  cache = data;
  writeChain = writeChain
    .then(() => persist())
    .catch((err) => {
      console.error("Failed to save admin data to Neon:", err);
    });
}

export async function flushDb(): Promise<void> {
  await writeChain;
}

export async function saveDB(data: AdminDatabase): Promise<void> {
  cache = data;
  await persist();
}

function teacherAssignmentsMatch(a: Teacher[], b: Teacher[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function applyTeacherAssignments(db: AdminDatabase): AdminDatabase {
  const patches: Record<string, Pick<Teacher, "roleTitle" | "courseIds">> = {
    "TCH-NAJAF": {
      roleTitle: "SEO, Marketing & Web Instructor",
      courseIds: ["C-101", "C-103", "C-104", "C-107"],
    },
    "TCH-USMAN": {
      roleTitle: "AI & Local SEO Instructor",
      courseIds: ["C-102", "C-105", "C-106", "C-108"],
    },
    "TCH-TAYYAB": {
      roleTitle: "AI Tools Instructor",
      courseIds: [],
    },
  };

  return {
    ...db,
    teachers: db.teachers.map((teacher) =>
      patches[teacher.id] ? { ...teacher, ...patches[teacher.id] } : teacher,
    ),
  };
}

function normalize(db: AdminDatabase, seed: AdminDatabase): AdminDatabase {
  const next: AdminDatabase = {
    users: Array.isArray(db.users) ? db.users : seed.users,
    courses: Array.isArray(db.courses) ? db.courses : seed.courses,
    batches: Array.isArray(db.batches) ? db.batches : seed.batches,
    students: Array.isArray(db.students) ? db.students : [],
    inquiries: Array.isArray(db.inquiries) ? db.inquiries : seed.inquiries,
    payments: Array.isArray(db.payments) ? db.payments : [],
    logs: Array.isArray(db.logs) ? db.logs : seed.logs,
    settings: db.settings || seed.settings,
    teachers: Array.isArray(db.teachers) ? db.teachers : seed.teachers,
  };

  next.users = next.users.map((u) => ({
    ...u,
    password:
      u.password ||
      (u.role === "Admin" ? "admin" : "accountant"),
  }));

  return next;
}

async function ensurePool(): Promise<pg.Pool> {
  if (pool) return pool;
  pool = new Pool({
    connectionString: connectionString(),
    ssl: { rejectUnauthorized: true },
    max: 4,
  });
  await pool.query("SELECT 1");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_store (
      id integer PRIMARY KEY,
      payload jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id text PRIMARY KEY,
      user_id text NOT NULL,
      expires_at timestamptz NOT NULL
    )
  `);
  return pool;
}

export async function initDb(seed: AdminDatabase, jsonFile: string): Promise<void> {
  if (initPromise) {
    await initPromise;
    return;
  }
  initPromise = (async () => {
    const dbPool = await ensurePool();
    const existing = await dbPool.query<{ payload: AdminDatabase }>(
      "SELECT payload FROM admin_store WHERE id = 1",
    );

    if (existing.rows[0]?.payload) {
      const normalized = normalize(existing.rows[0].payload, seed);
      const migrated = applyTeacherAssignments(normalized);
      cache = migrated;
      if (!teacherAssignmentsMatch(normalized.teachers, migrated.teachers)) {
        await persist();
        console.log("Admin data store: Neon PostgreSQL (migrated teacher assignments)");
      } else {
        console.log("Admin data store: Neon PostgreSQL (existing)");
      }
      return;
    }

    if (jsonFile && fs.existsSync(jsonFile)) {
      const local = JSON.parse(fs.readFileSync(jsonFile, "utf-8")) as AdminDatabase;
      cache = normalize(local, seed);
      await persist();
      console.log("Admin data store: Neon PostgreSQL (imported from local db.json)");
      return;
    }

    cache = structuredClone(seed);
    await persist();
    console.log("Admin data store: Neon PostgreSQL (seeded)");
  })();
  await initPromise;
}

export async function getFreshDB(seed: AdminDatabase): Promise<AdminDatabase> {
  await initDb(seed, path.join(process.cwd(), "admin/data/db.json"));
  const dbPool = await ensurePool();
  const existing = await dbPool.query<{ payload: AdminDatabase }>(
    "SELECT payload FROM admin_store WHERE id = 1",
  );
  if (existing.rows[0]?.payload) {
    cache = applyTeacherAssignments(normalize(existing.rows[0].payload, seed));
    return cache;
  }
  cache = structuredClone(seed);
  await persist();
  return cache;
}

export async function insertSession(sessionId: string, userId: string): Promise<void> {
  const dbPool = await ensurePool();
  await dbPool.query(
    `INSERT INTO admin_sessions (id, user_id, expires_at)
     VALUES ($1, $2, now() + interval '12 hours')
     ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at`,
    [sessionId, userId],
  );
}

export async function lookupSessionUserId(sessionId: string): Promise<string | null> {
  const dbPool = await ensurePool();
  const row = await dbPool.query<{ user_id: string }>(
    `UPDATE admin_sessions
     SET expires_at = now() + interval '12 hours'
     WHERE id = $1 AND expires_at > now()
     RETURNING user_id`,
    [sessionId],
  );
  return row.rows[0]?.user_id ?? null;
}

export async function deleteSessionRow(sessionId: string): Promise<void> {
  const dbPool = await ensurePool();
  await dbPool.query("DELETE FROM admin_sessions WHERE id = $1", [sessionId]);
}
