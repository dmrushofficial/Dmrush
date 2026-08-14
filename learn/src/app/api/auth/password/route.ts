import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSessionUserId,
  sanitizePortalStudent,
  SESSION_COOKIE,
} from "@/lib/portal/auth";
import { readPortalDb, writePortalDb } from "@/lib/portal/db";
import { hashPassword, verifyPassword } from "@/lib/portal/password";

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const userId = getSessionUserId(cookieStore.get(SESSION_COOKIE)?.value);
  if (!userId) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword || newPassword.length < 4) {
    return NextResponse.json(
      { success: false, message: "Current password and a new password (min 4 chars) are required." },
      { status: 400 },
    );
  }

  const db = readPortalDb();
  const index = db.students.findIndex((s) => s.id === userId && s.isActive);
  if (index === -1) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }
  if (!(await verifyPassword(currentPassword, db.students[index].password))) {
    return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 403 });
  }

  db.students[index].password = await hashPassword(newPassword);
  db.students[index].updatedAt = new Date().toISOString();
  writePortalDb(db);

  return NextResponse.json({
    success: true,
    user: sanitizePortalStudent(db.students[index]),
  });
}
