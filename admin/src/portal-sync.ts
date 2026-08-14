import type { Course, Student } from "./types.js";

export type PortalProvisionResult =
  | {
      provisioned: true;
      created: boolean;
      email: string;
      initialPassword?: string;
      loginUrl: string;
      courseName: string;
    }
  | {
      provisioned: false;
      reason: string;
    };

function learnBaseUrl(): string {
  return process.env.LEARN_INTERNAL_URL || "http://127.0.0.1:3001";
}

function provisionSecret(): string {
  return process.env.LEARN_PROVISION_SECRET || "dev-provision-secret";
}

function publicLoginUrl(): string {
  return process.env.LEARN_PUBLIC_URL || "http://localhost:3001/login";
}

export async function provisionStudentPortal(
  student: Student,
  course: Course | undefined,
  batchName?: string,
): Promise<PortalProvisionResult> {
  if (!student.email?.trim()) {
    return { provisioned: false, reason: "Student email is required for portal access." };
  }
  if (!course?.portalCourseId) {
    return {
      provisioned: false,
      reason: `Course "${course?.name || student.courseId}" is not linked to a Learn portal course.`,
    };
  }

  try {
    const res = await fetch(`${learnBaseUrl()}/api/internal/provision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provisionSecret()}`,
      },
      body: JSON.stringify({
        adminStudentId: student.id,
        email: student.email,
        name: student.name,
        fatherName: student.fatherName,
        phone: student.phone,
        cnic: student.cnic,
        cohort: batchName ? `${course.name} · ${batchName}` : course.name,
        portalCourseId: course.portalCourseId,
        courseName: course.name,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return {
        provisioned: false,
        reason: data.message || "Learn portal provisioning failed.",
      };
    }

    return {
      provisioned: true,
      created: Boolean(data.created),
      email: data.email,
      initialPassword: data.initialPassword,
      loginUrl: data.loginUrl || publicLoginUrl(),
      courseName: course.name,
    };
  } catch {
    return {
      provisioned: false,
      reason: "Could not reach Learn portal. Is it running on port 3001?",
    };
  }
}

export async function syncStudentPortal(
  student: Student,
  course: Course | undefined,
  batchName?: string,
): Promise<void> {
  if (!student.email?.trim() || !course?.portalCourseId) return;
  try {
    await fetch(`${learnBaseUrl()}/api/internal/provision`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provisionSecret()}`,
      },
      body: JSON.stringify({
        adminStudentId: student.id,
        email: student.email,
        name: student.name,
        fatherName: student.fatherName,
        phone: student.phone,
        cnic: student.cnic,
        cohort: batchName ? `${course.name} · ${batchName}` : course.name,
        portalCourseId: course.portalCourseId,
        courseName: course.name,
      }),
    });
  } catch {
    // Non-blocking sync on updates
  }
}

export async function resetStudentPortalPassword(
  adminStudentId: string,
): Promise<
  | { success: true; email: string; initialPassword: string; loginUrl: string }
  | { success: false; message: string }
> {
  try {
    const res = await fetch(`${learnBaseUrl()}/api/internal/provision/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provisionSecret()}`,
      },
      body: JSON.stringify({ adminStudentId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Could not reset portal password." };
    }
    return {
      success: true,
      email: data.email,
      initialPassword: data.initialPassword,
      loginUrl: data.loginUrl || publicLoginUrl(),
    };
  } catch {
    return { success: false, message: "Learn portal is not reachable (port 3001)." };
  }
}

export type TeacherPortalResult =
  | {
      provisioned: true;
      created: boolean;
      email: string;
      initialPassword?: string;
      loginUrl: string;
    }
  | { provisioned: false; reason: string };

export async function provisionTeacherPortal(input: {
  adminTeacherId: string;
  email: string;
  name: string;
  roleTitle: string;
  password?: string;
  assignedCourseIds: string[];
  isActive?: boolean;
}): Promise<TeacherPortalResult> {
  if (!input.email?.trim()) {
    return { provisioned: false, reason: "Teacher email is required for portal login." };
  }
  try {
    const res = await fetch(`${learnBaseUrl()}/api/internal/provision-teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provisionSecret()}`,
      },
      body: JSON.stringify({
        adminTeacherId: input.adminTeacherId,
        email: input.email,
        name: input.name,
        roleTitle: input.roleTitle,
        password: input.password,
        assignedCourseIds: input.assignedCourseIds,
        isActive: input.isActive !== false,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return {
        provisioned: false,
        reason: data.message || "Learn teacher provisioning failed.",
      };
    }
    return {
      provisioned: true,
      created: Boolean(data.created),
      email: data.email,
      initialPassword: data.initialPassword,
      loginUrl: data.loginUrl || publicLoginUrl(),
    };
  } catch {
    return {
      provisioned: false,
      reason: "Could not reach Learn portal. Is it running on port 3001?",
    };
  }
}

export async function syncTeacherPortal(input: {
  adminTeacherId: string;
  email: string;
  name: string;
  roleTitle: string;
  password?: string;
  assignedCourseIds: string[];
  isActive?: boolean;
}): Promise<void> {
  try {
    await fetch(`${learnBaseUrl()}/api/internal/provision-teacher`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provisionSecret()}`,
      },
      body: JSON.stringify(input),
    });
  } catch {
    // non-blocking
  }
}

export async function deleteTeacherPortal(adminTeacherId: string): Promise<void> {
  try {
    await fetch(
      `${learnBaseUrl()}/api/internal/provision-teacher?adminTeacherId=${encodeURIComponent(adminTeacherId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${provisionSecret()}` },
      },
    );
  } catch {
    // non-blocking
  }
}

export async function resetTeacherPortalPassword(
  adminTeacherId: string,
  password?: string,
): Promise<
  | { success: true; email: string; initialPassword: string; loginUrl: string }
  | { success: false; message: string }
> {
  try {
    const res = await fetch(`${learnBaseUrl()}/api/internal/provision-teacher/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provisionSecret()}`,
      },
      body: JSON.stringify({ adminTeacherId, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Could not reset teacher password." };
    }
    return {
      success: true,
      email: data.email,
      initialPassword: data.initialPassword,
      loginUrl: data.loginUrl || publicLoginUrl(),
    };
  } catch {
    return { success: false, message: "Learn portal is not reachable (port 3001)." };
  }
}
