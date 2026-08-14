import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyProvisionSecret } from "@/lib/portal/provision";
import { findTeacherByAdminId, upsertTeacher } from "@/lib/portal/lms-db";
import { hashPassword } from "@/lib/portal/password";

function publicLoginUrl() {
  return process.env.LEARN_PUBLIC_URL || "http://localhost:3001/login";
}

export async function POST(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const adminTeacherId = typeof body.adminTeacherId === "string" ? body.adminTeacherId.trim() : "";
  if (!adminTeacherId) {
    return NextResponse.json({ success: false, message: "adminTeacherId is required." }, { status: 400 });
  }

  const existing = findTeacherByAdminId(adminTeacherId);
  if (!existing || !existing.isActive) {
    return NextResponse.json({ success: false, message: "Teacher portal account not found." }, { status: 404 });
  }

  const password =
    typeof body.password === "string" && body.password.trim()
      ? body.password.trim()
      : `TCH${crypto.randomBytes(3).toString("hex")}`;

  upsertTeacher({
    ...existing,
    password: await hashPassword(password),
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    email: existing.email,
    initialPassword: password,
    loginUrl: publicLoginUrl(),
  });
}
