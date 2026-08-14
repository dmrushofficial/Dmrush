import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSession,
  destroySession,
  sanitizePortalStudent,
  sanitizePortalTeacher,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/portal/auth";
import { findPortalStudentByEmail, migrateStudentPasswordIfNeeded } from "@/lib/portal/db";
import { findTeacherByEmail, migrateTeacherPasswordIfNeeded } from "@/lib/portal/lms-db";
import { verifyPassword } from "@/lib/portal/password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password.trim() : "";

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required." },
      { status: 400 },
    );
  }

  const teacher = findTeacherByEmail(email);
  if (teacher && (await verifyPassword(password, teacher.password))) {
    await migrateTeacherPasswordIfNeeded(teacher.id, password);
    const cookieStore = await cookies();
    destroySession(cookieStore.get(SESSION_COOKIE)?.value);
    const token = createSession(teacher.id, "teacher");
    const response = NextResponse.json({
      success: true,
      role: "teacher",
      redirectTo: "/teacher/dashboard",
      user: sanitizePortalTeacher(teacher),
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  }

  const student = findPortalStudentByEmail(email);
  if (!student) {
    return NextResponse.json(
      {
        success: false,
        message:
          email === "admin@dmrush.com" || email === "accountant@dmrush.com"
            ? "That is the admin panel login. Use your student or teacher portal email here."
            : `No portal account for "${email}". Students use the email from admission. Teachers use the email created in Admin → Teachers.`,
      },
      { status: 401 },
    );
  }

  if (!(await verifyPassword(password, student.password))) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Wrong password. For students it is usually DM + last 6 phone digits. Reset from Admin → student profile.",
      },
      { status: 401 },
    );
  }

  await migrateStudentPasswordIfNeeded(student.id, password);

  const cookieStore = await cookies();
  destroySession(cookieStore.get(SESSION_COOKIE)?.value);
  const token = createSession(student.id, "student");
  const response = NextResponse.json({
    success: true,
    role: "student",
    redirectTo: "/student/dashboard",
    user: sanitizePortalStudent(student),
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
