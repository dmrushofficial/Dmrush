import crypto from "crypto";
import { SESSION_COOKIE } from "./constants";
import type {
  PortalRole,
  PortalStudent,
  PortalTeacher,
  SafePortalStudent,
  SafePortalTeacher,
} from "./types";
import { findPortalStudentById } from "./db";
import { findTeacherById } from "./lms-db";

export { SESSION_COOKIE };

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function sessionSecret(): string {
  if (process.env.LEARN_SESSION_SECRET && process.env.LEARN_SESSION_SECRET.length >= 16) {
    return process.env.LEARN_SESSION_SECRET;
  }
  if (!(globalThis as Record<string, unknown>).__dmrushLearnSessionSecret) {
    (globalThis as Record<string, unknown>).__dmrushLearnSessionSecret =
      crypto.randomBytes(32).toString("hex");
  }
  return (globalThis as Record<string, unknown>).__dmrushLearnSessionSecret as string;
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

/** Format: role.userId.expiresAt.signature */
export function createSession(userId: string, role: PortalRole = "student"): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${role}.${userId}.${expiresAt}`;
  return `${payload}.${signPayload(payload)}`;
}

export function destroySession(_token?: string): void {
  void _token;
}

export function parseSession(
  token: string | undefined,
): { role: PortalRole; userId: string } | null {
  if (!token || !token.includes(".")) return null;
  const parts = token.split(".");

  // New format: role.userId.expires.sig (4 parts)
  if (parts.length === 4) {
    const [role, userId, expiresAtStr, sig] = parts;
    if (role !== "student" && role !== "teacher") return null;
    if (!userId || !expiresAtStr || !sig) return null;
    const payload = `${role}.${userId}.${expiresAtStr}`;
    const expected = signPayload(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const expiresAt = Number(expiresAtStr);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
    return { role, userId };
  }

  // Legacy student format: userId.expires.sig
  if (parts.length === 3) {
    const [userId, expiresAtStr, sig] = parts;
    if (!userId || !expiresAtStr || !sig) return null;
    const payload = `${userId}.${expiresAtStr}`;
    const expected = signPayload(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const expiresAt = Number(expiresAtStr);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
    return { role: "student", userId };
  }

  return null;
}

export function getSessionUserId(token: string | undefined): string | null {
  return parseSession(token)?.userId ?? null;
}

export function sanitizePortalStudent(student: PortalStudent): SafePortalStudent {
  const { password, ...safe } = student;
  void password;
  return safe;
}

export function sanitizePortalTeacher(teacher: PortalTeacher): SafePortalTeacher {
  const { password, ...safe } = teacher;
  void password;
  return safe;
}

export function sessionCookieOptions() {
  const secure = process.env.LEARN_COOKIE_SECURE === "true";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function getSafeStudentFromToken(token: string | undefined): SafePortalStudent | null {
  const session = parseSession(token);
  if (!session || session.role !== "student") return null;
  const user = findPortalStudentById(session.userId);
  return user ? sanitizePortalStudent(user) : null;
}

export function getSafeTeacherFromToken(token: string | undefined): SafePortalTeacher | null {
  const session = parseSession(token);
  if (!session || session.role !== "teacher") return null;
  const user = findTeacherById(session.userId);
  return user ? sanitizePortalTeacher(user) : null;
}
