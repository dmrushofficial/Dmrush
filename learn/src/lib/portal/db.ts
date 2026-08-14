import fs from "fs";
import path from "path";
import type { PortalDatabase, PortalStudent } from "./types";
import { hashPassword, isPasswordHashed } from "./password";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "portal-students.json");

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ students: [] }, null, 2), "utf-8");
  }
}

export function readPortalDb(): PortalDatabase {
  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw) as PortalDatabase;
}

export function writePortalDb(db: PortalDatabase) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function findPortalStudentById(id: string): PortalStudent | undefined {
  return readPortalDb().students.find((s) => s.id === id && s.isActive);
}

export function findPortalStudentByEmail(email: string): PortalStudent | undefined {
  const normalized = email.trim().toLowerCase();
  return readPortalDb().students.find(
    (s) => s.email.toLowerCase() === normalized && s.isActive,
  );
}

export function findPortalStudentByAdminId(adminStudentId: string): PortalStudent | undefined {
  return readPortalDb().students.find((s) => s.adminStudentId === adminStudentId);
}

export function upsertPortalStudent(student: PortalStudent): PortalStudent {
  const db = readPortalDb();
  const index = db.students.findIndex(
    (s) => s.adminStudentId === student.adminStudentId || s.id === student.id,
  );
  if (index === -1) {
    db.students.unshift(student);
  } else {
    db.students[index] = { ...db.students[index], ...student, updatedAt: student.updatedAt };
  }
  writePortalDb(db);
  return student;
}

export async function migrateStudentPasswordIfNeeded(studentId: string, plaintext: string) {
  const db = readPortalDb();
  const index = db.students.findIndex((s) => s.id === studentId);
  if (index === -1) return;
  if (isPasswordHashed(db.students[index].password)) return;
  db.students[index].password = await hashPassword(plaintext);
  db.students[index].updatedAt = new Date().toISOString();
  writePortalDb(db);
}
