import fs from "fs";
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
} from "./types.js";

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

function requireCache(): AdminDatabase {
  if (!cache) {
    throw new Error("Admin database is not initialized.");
  }
  return cache;
}

function connectionString(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error("DATABASE_URL is missing. Put the Neon connection string in admin/.env");
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

export async function initDb(seed: AdminDatabase, jsonFile: string): Promise<void> {
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

  const existing = await pool.query<{ payload: AdminDatabase }>(
    "SELECT payload FROM admin_store WHERE id = 1",
  );

  if (existing.rows[0]?.payload) {
    cache = normalize(existing.rows[0].payload, seed);
    console.log("Admin data store: Neon PostgreSQL (existing)");
    return;
  }

  if (fs.existsSync(jsonFile)) {
    const local = JSON.parse(fs.readFileSync(jsonFile, "utf-8")) as AdminDatabase;
    cache = normalize(local, seed);
    await persist();
    console.log("Admin data store: Neon PostgreSQL (imported from local db.json)");
    return;
  }

  cache = structuredClone(seed);
  await persist();
  console.log("Admin data store: Neon PostgreSQL (seeded)");
}
