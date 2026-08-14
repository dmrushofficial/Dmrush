import { NextResponse } from "next/server";
import {
  buildPortalStudent,
  generatePortalPassword,
  verifyProvisionSecret,
} from "@/lib/portal/provision";
import {
  findPortalStudentByAdminId,
  upsertPortalStudent,
} from "@/lib/portal/db";
import { hashPassword, isPasswordHashed } from "@/lib/portal/password";

type ProvisionBody = {
  adminStudentId?: string;
  email?: string;
  name?: string;
  fatherName?: string;
  phone?: string;
  cnic?: string;
  cohort?: string;
  portalCourseId?: string;
  courseName?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as ProvisionBody;
  const adminStudentId = body.adminStudentId?.trim();
  const email = body.email?.trim().toLowerCase();
  const portalCourseId = body.portalCourseId?.trim();

  if (!adminStudentId || !email || !portalCourseId) {
    return NextResponse.json(
      {
        success: false,
        message: "adminStudentId, email, and portalCourseId are required.",
      },
      { status: 400 },
    );
  }

  const existing = findPortalStudentByAdminId(adminStudentId);
  const enrolledCourseIds = existing?.enrolledCourseIds || [];
  if (!enrolledCourseIds.includes(portalCourseId)) {
    enrolledCourseIds.push(portalCourseId);
  }

  const created = !existing;
  const plainPassword =
    (typeof body.password === "string" && body.password.trim()) ||
    (created ? generatePortalPassword(adminStudentId, body.phone || "") : undefined);

  const passwordHash = plainPassword
    ? await hashPassword(plainPassword)
    : existing!.password;

  const student = buildPortalStudent({
    adminStudentId,
    email,
    password: passwordHash,
    name: body.name || existing?.name || "Student",
    fatherName: body.fatherName || existing?.fatherName || "",
    phone: body.phone || existing?.phone || "",
    cnic: body.cnic || existing?.cnic || "",
    cohort: body.cohort || existing?.cohort || body.courseName || "Student Portal",
    enrolledCourseIds,
    existing: existing || undefined,
  });

  upsertPortalStudent(student);

  return NextResponse.json({
    success: true,
    created,
    portalStudentId: student.id,
    email: student.email,
    initialPassword: plainPassword,
    loginUrl: process.env.LEARN_PUBLIC_URL || "http://localhost:3001/login",
    enrolledCourseIds: student.enrolledCourseIds,
  });
}

export async function PUT(request: Request) {
  if (!verifyProvisionSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as ProvisionBody;
  const adminStudentId = body.adminStudentId?.trim();
  if (!adminStudentId) {
    return NextResponse.json({ success: false, message: "adminStudentId is required." }, { status: 400 });
  }

  const existing = findPortalStudentByAdminId(adminStudentId);
  if (!existing) {
    return NextResponse.json({ success: false, message: "Portal account not found." }, { status: 404 });
  }

  const portalCourseId = body.portalCourseId?.trim();
  const enrolledCourseIds = [...existing.enrolledCourseIds];
  if (portalCourseId && !enrolledCourseIds.includes(portalCourseId)) {
    enrolledCourseIds.push(portalCourseId);
  }

  let password = existing.password;
  if (typeof body.password === "string" && body.password.trim()) {
    password = await hashPassword(body.password.trim());
  } else if (!isPasswordHashed(password)) {
    // leave plaintext until login migration
  }

  const student = buildPortalStudent({
    adminStudentId,
    email: body.email || existing.email,
    password,
    name: body.name || existing.name,
    fatherName: body.fatherName ?? existing.fatherName,
    phone: body.phone ?? existing.phone,
    cnic: body.cnic ?? existing.cnic,
    cohort: body.cohort || body.courseName || existing.cohort,
    enrolledCourseIds,
    existing,
  });

  upsertPortalStudent(student);
  return NextResponse.json({ success: true, portalStudentId: student.id });
}
