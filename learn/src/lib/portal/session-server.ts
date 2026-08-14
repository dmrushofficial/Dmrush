import { cookies } from "next/headers";
import {
  getSafeStudentFromToken,
  getSafeTeacherFromToken,
  parseSession,
  SESSION_COOKIE,
} from "./auth";

export async function getPortalStudentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return getSafeStudentFromToken(token);
}

export async function getPortalTeacherSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return getSafeTeacherFromToken(token);
}

export async function getPortalSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const parsed = parseSession(token);
  if (!parsed) return null;
  if (parsed.role === "student") {
    const student = getSafeStudentFromToken(token);
    return student ? { role: "student" as const, student } : null;
  }
  const teacher = getSafeTeacherFromToken(token);
  return teacher ? { role: "teacher" as const, teacher } : null;
}
