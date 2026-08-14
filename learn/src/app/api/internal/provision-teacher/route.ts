import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyProvisionSecret } from "@/lib/portal/provision";
import {
  deactivateTeacherByAdminId,
  findTeacherByAdminId,
  findTeacherByEmail,
  newId,
  upsertTeacher,
} from "@/lib/portal/lms-db";
import type { PortalTeacher } from "@/lib/portal/types";
import { hashPassword, isPasswordHashed } from "@/lib/portal/password";

type Body = {
  adminTeacherId?: string;
  email?: string;
  password?: string;
  name?: string;
  roleTitle?: string;
  assignedCourseIds?: string[];
  isActive?: boolean;
};

function publicLoginUrl() {
  return process.env.LEARN_PUBLIC_URL || "http://localhost:3001/login";
}

function generateTeacherPassword(): string {
  return `TCH${crypto.randomBytes(3).toString("hex")}`;
}

export async function POST(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const adminTeacherId = body.adminTeacherId?.trim();
  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();

  if (!adminTeacherId || !email || !name) {
    return NextResponse.json(
      { success: false, message: "adminTeacherId, email, and name are required." },
      { status: 400 },
    );
  }

  const existingByAdmin = findTeacherByAdminId(adminTeacherId);
  const existingByEmail = findTeacherByEmail(email);
  if (existingByEmail && existingByEmail.adminTeacherId && existingByEmail.adminTeacherId !== adminTeacherId) {
    return NextResponse.json(
      { success: false, message: `Email "${email}" is already used by another teacher.` },
      { status: 409 },
    );
  }
  if (existingByAdmin && existingByEmail && existingByAdmin.id !== existingByEmail.id) {
    return NextResponse.json(
      { success: false, message: `Email "${email}" is already used by another teacher.` },
      { status: 409 },
    );
  }

  const existing = existingByAdmin || existingByEmail;
  const created = !existing;
  const plainPassword =
    (typeof body.password === "string" && body.password.trim()) ||
    (created ? generateTeacherPassword() : undefined);

  const passwordHash = plainPassword
    ? await hashPassword(plainPassword)
    : existing!.password;

  const now = new Date().toISOString();
  const teacher: PortalTeacher = {
    id: existing?.id || newId("PT"),
    adminTeacherId,
    email,
    password: passwordHash,
    name,
    roleTitle: body.roleTitle?.trim() || existing?.roleTitle || "Instructor",
    assignedCourseIds: Array.isArray(body.assignedCourseIds)
      ? Array.from(new Set(body.assignedCourseIds.filter(Boolean)))
      : existing?.assignedCourseIds || [],
    isActive: body.isActive !== false,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  upsertTeacher(teacher);

  return NextResponse.json({
    success: true,
    created,
    portalTeacherId: teacher.id,
    email: teacher.email,
    initialPassword: plainPassword,
    loginUrl: publicLoginUrl(),
    assignedCourseIds: teacher.assignedCourseIds,
  });
}

export async function PUT(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const adminTeacherId = body.adminTeacherId?.trim();
  if (!adminTeacherId) {
    return NextResponse.json({ success: false, message: "adminTeacherId is required." }, { status: 400 });
  }

  const existing = findTeacherByAdminId(adminTeacherId);
  if (!existing) {
    return NextResponse.json({ success: false, message: "Teacher portal account not found." }, { status: 404 });
  }

  if (body.email) {
    const email = body.email.trim().toLowerCase();
    const clash = findTeacherByEmail(email);
    if (clash && clash.id !== existing.id) {
      return NextResponse.json(
        { success: false, message: `Email "${email}" is already used by another teacher.` },
        { status: 409 },
      );
    }
  }

  let password = existing.password;
  if (typeof body.password === "string" && body.password.trim()) {
    password = await hashPassword(body.password.trim());
  } else if (!isPasswordHashed(password)) {
    // migrate on next login
  }

  const teacher: PortalTeacher = {
    ...existing,
    email: body.email?.trim().toLowerCase() || existing.email,
    name: body.name?.trim() || existing.name,
    roleTitle: body.roleTitle?.trim() || existing.roleTitle,
    password,
    assignedCourseIds: Array.isArray(body.assignedCourseIds)
      ? Array.from(new Set(body.assignedCourseIds.filter(Boolean)))
      : existing.assignedCourseIds,
    isActive: body.isActive === undefined ? existing.isActive : body.isActive !== false,
    updatedAt: new Date().toISOString(),
  };

  upsertTeacher(teacher);
  return NextResponse.json({ success: true, portalTeacherId: teacher.id });
}

export async function DELETE(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
  const adminTeacherId = new URL(request.url).searchParams.get("adminTeacherId")?.trim();
  if (!adminTeacherId) {
    return NextResponse.json({ success: false, message: "adminTeacherId is required." }, { status: 400 });
  }
  const ok = deactivateTeacherByAdminId(adminTeacherId);
  return NextResponse.json({ success: ok });
}
