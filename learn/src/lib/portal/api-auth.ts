import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSafeStudentFromToken,
  getSafeTeacherFromToken,
  SESSION_COOKIE,
} from "@/lib/portal/auth";
import type { SafePortalStudent, SafePortalTeacher } from "@/lib/portal/types";

export async function requireStudent(): Promise<
  { student: SafePortalStudent } | { error: NextResponse }
> {
  const cookieStore = await cookies();
  const student = getSafeStudentFromToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!student) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  return { student };
}

export async function requireTeacher(): Promise<
  { teacher: SafePortalTeacher } | { error: NextResponse }
> {
  const cookieStore = await cookies();
  const teacher = getSafeTeacherFromToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!teacher) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  return { teacher };
}
