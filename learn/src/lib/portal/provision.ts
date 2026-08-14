import crypto from "crypto";
import type { PortalStudent } from "@/lib/portal/types";

export function generatePortalPassword(adminStudentId: string, phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 4) {
    return `DM${digits.slice(-6)}`;
  }
  const compact = adminStudentId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return `DM${compact.slice(-8)}`;
}

export function generatePortalStudentId(): string {
  return `PS-${crypto.randomBytes(4).toString("hex")}`;
}

export function buildPortalStudent(input: {
  adminStudentId: string;
  email: string;
  password: string;
  name: string;
  fatherName: string;
  phone: string;
  cnic: string;
  cohort: string;
  enrolledCourseIds: string[];
  existing?: PortalStudent;
}): PortalStudent {
  const now = new Date().toISOString();
  const existing = input.existing;
  const enrolledCourseIds = input.enrolledCourseIds.length
    ? Array.from(new Set(input.enrolledCourseIds))
    : existing?.enrolledCourseIds || [];

  return {
    id: existing?.id || generatePortalStudentId(),
    adminStudentId: input.adminStudentId,
    email: input.email.trim().toLowerCase(),
    password: input.password,
    name: input.name,
    fatherName: input.fatherName,
    phone: input.phone,
    cnic: input.cnic,
    cohort: input.cohort,
    enrolledCourseIds,
    isActive: true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export function verifyProvisionSecret(authHeader: string | null): boolean {
  const secret = process.env.LEARN_PROVISION_SECRET || "dev-provision-secret";
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length);
  if (token.length !== secret.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret));
}
