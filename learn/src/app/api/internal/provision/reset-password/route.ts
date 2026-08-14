import { NextResponse } from "next/server";
import {
  generatePortalPassword,
  verifyProvisionSecret,
} from "@/lib/portal/provision";
import {
  findPortalStudentByAdminId,
  readPortalDb,
  writePortalDb,
} from "@/lib/portal/db";
import { hashPassword } from "@/lib/portal/password";

export async function POST(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const adminStudentId =
    typeof body.adminStudentId === "string" ? body.adminStudentId.trim() : "";
  if (!adminStudentId) {
    return NextResponse.json(
      { success: false, message: "adminStudentId is required." },
      { status: 400 },
    );
  }

  const existing = findPortalStudentByAdminId(adminStudentId);
  if (!existing) {
    return NextResponse.json(
      { success: false, message: "No portal account found for this student." },
      { status: 404 },
    );
  }

  const newPassword =
    typeof body.password === "string" && body.password.trim()
      ? body.password.trim()
      : generatePortalPassword(adminStudentId, existing.phone);
  const db = readPortalDb();
  const index = db.students.findIndex((s) => s.adminStudentId === adminStudentId);
  if (index === -1) {
    return NextResponse.json({ success: false, message: "Portal account not found." }, { status: 404 });
  }

  db.students[index].password = await hashPassword(newPassword);
  db.students[index].updatedAt = new Date().toISOString();
  writePortalDb(db);

  return NextResponse.json({
    success: true,
    email: db.students[index].email,
    initialPassword: newPassword,
    loginUrl: process.env.LEARN_PUBLIC_URL || "http://localhost:3001/login",
  });
}
