import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import { User, UserRole } from "./types.js";

export const SESSION_COOKIE = "dmrush_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

type SessionRecord = {
  userId: string;
  expiresAt: number;
};

const sessions = new Map<string, SessionRecord>();

function sessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[admin-auth] ADMIN_SESSION_SECRET is missing or too short. Using an ephemeral secret for this process only.",
    );
  }
  // Dev / fallback: stable-enough per process; sessions reset on restart.
  if (!(globalThis as any).__dmrushAdminSessionSecret) {
    (globalThis as any).__dmrushAdminSessionSecret = crypto.randomBytes(32).toString("hex");
  }
  return (globalThis as any).__dmrushAdminSessionSecret as string;
}

function signToken(sessionId: string): string {
  const sig = crypto.createHmac("sha256", sessionSecret()).update(sessionId).digest("hex");
  return `${sessionId}.${sig}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [sessionId, sig] = token.split(".");
  if (!sessionId || !sig) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(sessionId).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return sessionId;
}

export type SafeUser = Omit<User, "password">;

export function sanitizeUser(user: User): SafeUser {
  const { password: _password, ...safe } = user;
  return safe;
}

export function createSession(userId: string): string {
  const sessionId = crypto.randomBytes(32).toString("hex");
  sessions.set(sessionId, {
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return signToken(sessionId);
}

export function destroySession(token: string | undefined): void {
  const sessionId = verifyToken(token);
  if (sessionId) sessions.delete(sessionId);
}

export function getSessionUserId(token: string | undefined): string | null {
  const sessionId = verifyToken(token);
  if (!sessionId) return null;
  const record = sessions.get(sessionId);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  // sliding expiration
  record.expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(sessionId, record);
  return record.userId;
}

export function sessionCookieOptions() {
  // Enable Secure cookies explicitly for HTTPS deployments (ADMIN_COOKIE_SECURE=true).
  // Do not infer solely from NODE_ENV so local production builds over HTTP still work.
  const secure = process.env.ADMIN_COOKIE_SECURE === "true";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: SESSION_TTL_MS,
  };
}

export type AuthedRequest = Request & {
  adminUser?: SafeUser;
};

export function requireAuth(
  findUserById: (id: string) => User | undefined,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = (req as any).cookies?.[SESSION_COOKIE] as string | undefined;
    const userId = getSessionUserId(token);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    const user = findUserById(userId);
    if (!user || !user.isActive) {
      destroySession(token);
      res.clearCookie(SESSION_COOKIE, { path: "/admin" });
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    (req as AuthedRequest).adminUser = sanitizeUser(user);
    return next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as AuthedRequest).adminUser;
  if (!user || user.role !== UserRole.Admin) {
    return res.status(403).json({ success: false, message: "Admin privileges required." });
  }
  return next();
}
