import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  deleteSessionRow,
  getFreshDB,
  insertSession,
  lookupSessionUserId,
  saveDB,
  type AdminDatabase,
} from "../../../admin/src/db-store";
import { INITIAL_DATABASE } from "../../../admin/src/seed";
import {
  deleteTeacherPortal,
  provisionStudentPortal,
  provisionTeacherPortal,
  resetStudentPortalPassword,
  resetTeacherPortalPassword,
  syncStudentPortal,
} from "../../../admin/src/portal-sync";
import {
  BatchStatus,
  CourseStatus,
  LeadSource,
  LeadStatus,
  PaymentMethod,
  Shift,
  StudentStatus,
  UserRole,
  type Batch,
  type Course,
  type Inquiry,
  type Payment,
  type Student,
  type Teacher,
  type User,
} from "../../../admin/src/types";

function sanitizeUser(user: User) {
  const { password: _password, ...safe } = user;
  return safe;
}

export const SESSION_COOKIE = "dmrush_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function sessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  const material = process.env.DATABASE_URL || "dmrush-dev";
  return crypto.createHash("sha256").update(`dmrush-admin:${material}`).digest("hex");
}

function signToken(sessionId: string): string {
  const sig = crypto.createHmac("sha256", sessionSecret()).update(sessionId).digest("hex");
  return `${sessionId}.${sig}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [sessionId, sig] = token.split(".");
  if (!sessionId || !sig) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(sessionId).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return sessionId;
}

function cookieOptions() {
  const secure = process.env.ADMIN_COOKIE_SECURE === "true" || process.env.VERCEL === "1";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

function json(data: unknown, status = 200, cookie?: { set?: string; clear?: boolean }) {
  const res = NextResponse.json(data, { status });
  if (cookie?.clear) {
    res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  }
  if (cookie?.set) {
    res.cookies.set(SESSION_COOKIE, cookie.set, cookieOptions());
  }
  return res;
}

function match(pathname: string, pattern: string): Record<string, string> | null {
  const pp = pattern.split("/").filter(Boolean);
  const sp = pathname.split("/").filter(Boolean);
  if (pp.length !== sp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(":")) params[pp[i].slice(1)] = decodeURIComponent(sp[i]);
    else if (pp[i] !== sp[i]) return null;
  }
  return params;
}

function addLog(db: AdminDatabase, action: string, details: string, user = "Admin User", role = UserRole.Admin) {
  const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = new Date().toISOString().split("T")[0];
  db.logs.unshift({
    id: `LOG-${Date.now()}`,
    user,
    role,
    action,
    details,
    date: dateStr,
    time: timeStr,
    ipAddress: "vercel",
  });
  if (db.logs.length > 200) db.logs = db.logs.slice(0, 200);
}

function mapCourseIdsToPortalIds(db: AdminDatabase, courseIds: string[]): string[] {
  return courseIds
    .map((id) => db.courses.find((c) => c.id === id)?.portalCourseId)
    .filter((id): id is string => Boolean(id));
}

async function actorFromCookie(req: NextRequest, db: AdminDatabase): Promise<ReturnType<typeof sanitizeUser> | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const sessionId = verifyToken(token);
  if (!sessionId) return null;
  const userId = await lookupSessionUserId(sessionId);
  if (!userId) return null;
  const user = db.users.find((u) => u.id === userId && u.isActive);
  return user ? sanitizeUser(user) : null;
}

export async function handleAdminApi(req: NextRequest): Promise<NextResponse> {
  const pathname = new URL(req.url).pathname.replace(/\/$/, "") || "/";
  const method = req.method;
  const body = method === "GET" || method === "HEAD" ? {} : await req.json().catch(() => ({}));
  const db = await getFreshDB(INITIAL_DATABASE as AdminDatabase);
  const actor = await actorFromCookie(req, db);

  const isPublicAuth =
    (method === "POST" && match(pathname, "/admin/api/auth/login")) ||
    (method === "POST" && match(pathname, "/admin/api/auth/logout"));

  if (!isPublicAuth && !actor) {
    return json({ success: false, message: "Authentication required." }, 401);
  }

  const requireAdmin = () => {
    if (!actor || actor.role !== UserRole.Admin) {
      return json({ success: false, message: "Admin privileges required." }, 403);
    }
    return null;
  };

  if (method === "POST" && match(pathname, "/admin/api/auth/login")) {
    const { email, password } = body as { email?: string; password?: string };
    if (typeof email !== "string" || typeof password !== "string") {
      return json({ success: false, message: "Email and password are required." }, 400);
    }
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.isActive,
    );
    if (!user) {
      return json({ success: false, message: "Invalid email or password credentials." }, 401);
    }
    const prev = verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (prev) await deleteSessionRow(prev);
    const sessionId = crypto.randomBytes(32).toString("hex");
    await insertSession(sessionId, user.id);
    addLog(db, "User Logged In", `Logged in successfully via ${email}`, user.name, user.role);
    await saveDB(db);
    return json({ success: true, user: sanitizeUser(user) }, 200, { set: signToken(sessionId) });
  }

  if (method === "POST" && match(pathname, "/admin/api/auth/logout")) {
    const prev = verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (prev) await deleteSessionRow(prev);
    return json({ success: true }, 200, { clear: true });
  }

  if (method === "GET" && match(pathname, "/admin/api/auth/me")) {
    return json({ success: true, user: actor });
  }

  if (method === "POST" && match(pathname, "/admin/api/auth/switch-role")) {
    const denied = requireAdmin();
    if (denied) return denied;
    const { role } = body as { role?: string };
    if (role !== UserRole.Admin && role !== UserRole.Accountant) {
      return json({ success: false, message: "Invalid role." }, 400);
    }
    const target = db.users.find((u) => u.role === role && u.isActive);
    if (!target) return json({ success: false, message: "Target user not found." }, 404);
    const prev = verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (prev) await deleteSessionRow(prev);
    const sessionId = crypto.randomBytes(32).toString("hex");
    await insertSession(sessionId, target.id);
    addLog(db, "Role Switch", `Switched active session to ${target.role} (${target.email}).`, actor?.name, UserRole.Admin);
    await saveDB(db);
    return json({ success: true, user: sanitizeUser(target) }, 200, { set: signToken(sessionId) });
  }

  if (method === "GET" && match(pathname, "/admin/api/users")) {
    const denied = requireAdmin();
    if (denied) return denied;
    return json(db.users.map(sanitizeUser));
  }

  const userUpdate = match(pathname, "/admin/api/users/:id");
  if (method === "PUT" && userUpdate) {
    const denied = requireAdmin();
    if (denied) return denied;
    const userIndex = db.users.findIndex((u) => u.id === userUpdate.id);
    if (userIndex === -1) return json({ success: false, message: "User not found." }, 404);
    const { email, password, name } = body as { email?: string; password?: string; name?: string };
    if (typeof email === "string") db.users[userIndex].email = email;
    if (typeof name === "string") db.users[userIndex].name = name;
    if (typeof password === "string" && password.length > 0) db.users[userIndex].password = password;
    addLog(db, "User Updated", `Admin updated profile/credentials of ${db.users[userIndex].name}.`, actor?.name, UserRole.Admin);
    await saveDB(db);
    return json({ success: true, user: sanitizeUser(db.users[userIndex]) });
  }

  if (method === "POST" && match(pathname, "/admin/api/db/reset")) {
    const denied = requireAdmin();
    if (denied) return denied;
    const next = structuredClone(INITIAL_DATABASE) as AdminDatabase;
    addLog(next, "Database Reset", "Database was restored to default initial state.", "System", UserRole.Admin);
    await saveDB(next);
    return json({ success: true, message: "Database successfully reset to initial default state." });
  }

  if (method === "GET" && match(pathname, "/admin/api/students")) return json(db.students);

  if (method === "POST" && match(pathname, "/admin/api/students")) {
    const studentData = body as Partial<Student>;
    const year = new Date().getFullYear();
    const idStr = String(db.students.length + 1).padStart(3, "0");
    const newStudent: Student = {
      id: `DM-${year}-${idStr}`,
      name: studentData.name || "Unknown",
      fatherName: studentData.fatherName || "",
      cnic: studentData.cnic || "",
      phone: studentData.phone || "",
      email: studentData.email || "",
      admissionDate: studentData.admissionDate || new Date().toISOString().split("T")[0],
      courseId: studentData.courseId || "",
      batchId: studentData.batchId || "",
      shift: studentData.shift || Shift.Morning,
      startDate: studentData.startDate || "",
      endDate: studentData.endDate || "",
      duration: studentData.duration || "3 Months",
      status: studentData.status || StudentStatus.Active,
      notes: studentData.notes || "",
      totalFee: Number(studentData.totalFee) || 0,
      discount: Number(studentData.discount) || 0,
      paidAmount: Number(studentData.paidAmount) || 0,
      pendingAmount:
        (Number(studentData.totalFee) || 0) - (Number(studentData.discount) || 0) - (Number(studentData.paidAmount) || 0),
      dueDate: studentData.dueDate || "",
      nextInstallmentDate: studentData.nextInstallmentDate || "",
    };
    db.students.unshift(newStudent);
    if (newStudent.paidAmount > 0) {
      const course = db.courses.find((c) => c.id === newStudent.courseId);
      const batch = db.batches.find((b) => b.id === newStudent.batchId);
      db.payments.unshift({
        id: `RCP-${10000 + db.payments.length + 1}`,
        studentId: newStudent.id,
        studentName: newStudent.name,
        courseName: course ? course.name : "N/A",
        batchName: batch ? batch.name : "N/A",
        amountPaid: newStudent.paidAmount,
        previousBalance: newStudent.totalFee - newStudent.discount,
        remainingBalance: newStudent.pendingAmount,
        paymentMethod: PaymentMethod.Cash,
        paymentDate: newStudent.admissionDate,
        paymentTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        accountantName: actor?.name || "Admin User",
        notes: "Admission Down-payment received during registration",
      });
    }
    addLog(db, "Student Admitted", `Registered ${newStudent.name} (ID: ${newStudent.id}).`, actor?.name);
    await saveDB(db);
    const course = db.courses.find((c) => c.id === newStudent.courseId);
    const batch = db.batches.find((b) => b.id === newStudent.batchId);
    const portalAccount = await provisionStudentPortal(newStudent, course, batch?.name);
    return json({ success: true, student: newStudent, portalAccount });
  }

  const studentId = match(pathname, "/admin/api/students/:id");
  if (method === "PUT" && studentId) {
    const index = db.students.findIndex((s) => s.id === studentId.id);
    if (index === -1) return json({ success: false, message: "Student record not found." }, 404);
    const oldStudent = db.students[index];
    const updatedData = body as Partial<Student>;
    const totalFee = Number(updatedData.totalFee !== undefined ? updatedData.totalFee : oldStudent.totalFee);
    const discount = Number(updatedData.discount !== undefined ? updatedData.discount : oldStudent.discount);
    const paidAmount = Number(updatedData.paidAmount !== undefined ? updatedData.paidAmount : oldStudent.paidAmount);
    db.students[index] = { ...oldStudent, ...updatedData, totalFee, discount, paidAmount, pendingAmount: totalFee - discount - paidAmount };
    addLog(db, "Student Updated", `Modified records for student ${db.students[index].name}.`, actor?.name);
    await saveDB(db);
    const updatedStudent = db.students[index];
    const course = db.courses.find((c) => c.id === updatedStudent.courseId);
    const batch = db.batches.find((b) => b.id === updatedStudent.batchId);
    await syncStudentPortal(updatedStudent, course, batch?.name);
    return json({ success: true, student: updatedStudent });
  }

  const studentReset = match(pathname, "/admin/api/students/:id/portal-reset-password");
  if (method === "POST" && studentReset) {
    const student = db.students.find((s) => s.id === studentReset.id);
    if (!student) return json({ success: false, message: "Student not found." }, 404);
    const result = await resetStudentPortalPassword(studentReset.id);
    if (!result.success) return json(result, 400);
    return json({
      success: true,
      portalAccount: { provisioned: true, email: result.email, initialPassword: result.initialPassword, loginUrl: result.loginUrl },
    });
  }

  if (method === "DELETE" && studentId) {
    const student = db.students.find((s) => s.id === studentId.id);
    if (!student) return json({ success: false, message: "Student record not found." }, 404);
    db.students = db.students.filter((s) => s.id !== studentId.id);
    addLog(db, "Student Deleted", `Permanently deleted student profile of ${student.name}.`, actor?.name);
    await saveDB(db);
    return json({ success: true, message: "Student record permanently deleted." });
  }

  if (method === "GET" && match(pathname, "/admin/api/teachers")) return json(db.teachers || []);

  if (method === "POST" && match(pathname, "/admin/api/teachers")) {
    const denied = requireAdmin();
    if (denied) return denied;
    const { name, email, phone, roleTitle, courseIds, password, isActive } = body as Partial<Teacher> & { password?: string };
    if (!name?.trim() || !email?.trim()) return json({ success: false, message: "Name and email are required." }, 400);
    const normalizedEmail = String(email).trim().toLowerCase();
    if ((db.teachers || []).some((t) => t.email.toLowerCase() === normalizedEmail)) {
      return json({ success: false, message: "A teacher with this email already exists." }, 409);
    }
    const teacher: Teacher = {
      id: `TCH-${Date.now().toString(36).toUpperCase()}`,
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || "").trim(),
      roleTitle: String(roleTitle || "Instructor").trim(),
      courseIds: Array.isArray(courseIds) ? courseIds : [],
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
    };
    const portal = await provisionTeacherPortal({
      adminTeacherId: teacher.id,
      email: teacher.email,
      name: teacher.name,
      roleTitle: teacher.roleTitle,
      password: typeof password === "string" ? password.trim() : undefined,
      assignedCourseIds: mapCourseIdsToPortalIds(db, teacher.courseIds),
      isActive: teacher.isActive,
    });
    if (portal.provisioned && portal.initialPassword) teacher.lastPortalPassword = portal.initialPassword;
    db.teachers = db.teachers || [];
    db.teachers.unshift(teacher);
    addLog(db, "Teacher Added", `Created teacher ${teacher.name} (${teacher.email}).`, actor?.name, UserRole.Admin);
    await saveDB(db);
    return json({
      success: true,
      teacher,
      portalAccount: portal.provisioned
        ? { provisioned: true, created: portal.created, email: portal.email, initialPassword: portal.initialPassword, loginUrl: portal.loginUrl }
        : { provisioned: false, reason: portal.reason },
    });
  }

  const teacherId = match(pathname, "/admin/api/teachers/:id");
  if (method === "PUT" && teacherId) {
    const denied = requireAdmin();
    if (denied) return denied;
    const idx = (db.teachers || []).findIndex((t) => t.id === teacherId.id);
    if (idx === -1) return json({ success: false, message: "Teacher not found." }, 404);
    const prev = db.teachers[idx];
    const { name, email, phone, roleTitle, courseIds, password, isActive } = body as Partial<Teacher> & { password?: string };
    const nextEmail = email ? String(email).trim().toLowerCase() : prev.email;
    const updated: Teacher = {
      ...prev,
      name: name !== undefined ? String(name).trim() : prev.name,
      email: nextEmail,
      phone: phone !== undefined ? String(phone).trim() : prev.phone,
      roleTitle: roleTitle !== undefined ? String(roleTitle).trim() : prev.roleTitle,
      courseIds: Array.isArray(courseIds) ? courseIds : prev.courseIds,
      isActive: isActive === undefined ? prev.isActive : isActive !== false,
    };
    const portal = await provisionTeacherPortal({
      adminTeacherId: updated.id,
      email: updated.email,
      name: updated.name,
      roleTitle: updated.roleTitle,
      password: typeof password === "string" && password.trim() ? password.trim() : undefined,
      assignedCourseIds: mapCourseIdsToPortalIds(db, updated.courseIds),
      isActive: updated.isActive,
    });
    if (portal.provisioned && portal.initialPassword) updated.lastPortalPassword = portal.initialPassword;
    db.teachers[idx] = updated;
    addLog(db, "Teacher Updated", `Updated teacher ${updated.name}.`, actor?.name, UserRole.Admin);
    await saveDB(db);
    return json({ success: true, teacher: updated });
  }

  const teacherReset = match(pathname, "/admin/api/teachers/:id/portal-reset-password");
  if (method === "POST" && teacherReset) {
    const denied = requireAdmin();
    if (denied) return denied;
    const teacher = (db.teachers || []).find((t) => t.id === teacherReset.id);
    if (!teacher) return json({ success: false, message: "Teacher not found." }, 404);
    const password = typeof body?.password === "string" && body.password.trim() ? body.password.trim() : undefined;
    const result = await resetTeacherPortalPassword(teacher.id, password);
    if (result.success === false) return json({ success: false, message: result.message }, 502);
    teacher.lastPortalPassword = result.initialPassword;
    await saveDB(db);
    return json({
      success: true,
      portalAccount: { provisioned: true, email: result.email, initialPassword: result.initialPassword, loginUrl: result.loginUrl },
    });
  }

  if (method === "DELETE" && teacherId) {
    const denied = requireAdmin();
    if (denied) return denied;
    const teacher = (db.teachers || []).find((t) => t.id === teacherId.id);
    if (!teacher) return json({ success: false, message: "Teacher not found." }, 404);
    await deleteTeacherPortal(teacher.id);
    db.teachers = (db.teachers || []).filter((t) => t.id !== teacherId.id);
    addLog(db, "Teacher Deleted", `Deleted teacher ${teacher.name}.`, actor?.name, UserRole.Admin);
    await saveDB(db);
    return json({ success: true });
  }

  if (method === "GET" && match(pathname, "/admin/api/courses")) return json(db.courses);
  if (method === "POST" && match(pathname, "/admin/api/courses")) {
    const { name, duration, totalFee, description, status } = body as Partial<Course>;
    const newCourse: Course = {
      id: `C-${100 + db.courses.length + 1}`,
      name: name || "New Course",
      duration: duration || "3 Months",
      totalFee: Number(totalFee) || 0,
      description: description || "",
      status: status || CourseStatus.Active,
    };
    db.courses.push(newCourse);
    addLog(db, "Course Created", `Added new course: ${newCourse.name}.`, actor?.name);
    await saveDB(db);
    return json({ success: true, course: newCourse });
  }
  const courseId = match(pathname, "/admin/api/courses/:id");
  if (method === "PUT" && courseId) {
    const index = db.courses.findIndex((c) => c.id === courseId.id);
    if (index === -1) return json({ success: false, message: "Course not found" }, 404);
    db.courses[index] = { ...db.courses[index], ...(body as Course) };
    await saveDB(db);
    return json({ success: true, course: db.courses[index] });
  }
  if (method === "DELETE" && courseId) {
    const course = db.courses.find((c) => c.id === courseId.id);
    if (!course) return json({ success: false, message: "Course not found" }, 404);
    db.courses = db.courses.filter((c) => c.id !== courseId.id);
    await saveDB(db);
    return json({ success: true });
  }

  if (method === "GET" && match(pathname, "/admin/api/batches")) return json(db.batches);
  if (method === "POST" && match(pathname, "/admin/api/batches")) {
    const { courseId: cid, name, startDate, endDate, capacity, status } = body as Partial<Batch>;
    const newBatch: Batch = {
      id: `B-${100 + db.batches.length + 1}`,
      courseId: cid || "",
      name: name || "New Batch",
      startDate: startDate || "",
      endDate: endDate || "",
      capacity: Number(capacity) || 20,
      status: status || BatchStatus.Upcoming,
    };
    db.batches.push(newBatch);
    await saveDB(db);
    return json({ success: true, batch: newBatch });
  }
  const batchId = match(pathname, "/admin/api/batches/:id");
  if (method === "PUT" && batchId) {
    const index = db.batches.findIndex((b) => b.id === batchId.id);
    if (index === -1) return json({ success: false, message: "Batch not found" }, 404);
    db.batches[index] = { ...db.batches[index], ...(body as Batch) };
    await saveDB(db);
    return json({ success: true, batch: db.batches[index] });
  }
  if (method === "DELETE" && batchId) {
    db.batches = db.batches.filter((b) => b.id !== batchId.id);
    await saveDB(db);
    return json({ success: true });
  }

  if (method === "GET" && match(pathname, "/admin/api/inquiries")) return json(db.inquiries);
  if (method === "POST" && match(pathname, "/admin/api/inquiries")) {
    const leadData = body as Partial<Inquiry>;
    const newLead: Inquiry = {
      id: `L-${100 + db.inquiries.length + 1}`,
      name: leadData.name || "Anonymous Lead",
      phone: leadData.phone || "",
      email: leadData.email || "",
      interestedCourseId: leadData.interestedCourseId || "",
      source: leadData.source || LeadSource.Website,
      notes: leadData.notes || "",
      followUpDate: leadData.followUpDate || "",
      status: leadData.status || LeadStatus.New,
      createdAt: new Date().toISOString(),
    };
    db.inquiries.unshift(newLead);
    await saveDB(db);
    return json({ success: true, inquiry: newLead });
  }
  const inquiryId = match(pathname, "/admin/api/inquiries/:id");
  if (method === "PUT" && inquiryId) {
    const index = db.inquiries.findIndex((q) => q.id === inquiryId.id);
    if (index === -1) return json({ success: false, message: "Inquiry not found" }, 404);
    db.inquiries[index] = { ...db.inquiries[index], ...(body as Inquiry) };
    await saveDB(db);
    return json({ success: true, inquiry: db.inquiries[index] });
  }
  if (method === "DELETE" && inquiryId) {
    db.inquiries = db.inquiries.filter((q) => q.id !== inquiryId.id);
    await saveDB(db);
    return json({ success: true });
  }

  if (method === "GET" && match(pathname, "/admin/api/payments")) return json(db.payments);
  if (method === "POST" && match(pathname, "/admin/api/payments")) {
    const { studentId: sid, amountPaid, paymentMethod, notes, accountantName } = body as {
      studentId?: string;
      amountPaid?: number;
      paymentMethod?: PaymentMethod;
      notes?: string;
      accountantName?: string;
    };
    const studentIndex = db.students.findIndex((s) => s.id === sid);
    if (studentIndex === -1) return json({ success: false, message: "Student matching ID not found." }, 404);
    const student = db.students[studentIndex];
    const paymentAmount = Number(amountPaid);
    if (paymentAmount <= 0) return json({ success: false, message: "Payment amount must be greater than zero." }, 400);
    if (paymentAmount > student.pendingAmount) {
      return json({ success: false, message: `Excess Payment warning! Student only owes ${student.pendingAmount} PKR.` }, 400);
    }
    const prevBalance = student.pendingAmount;
    student.paidAmount += paymentAmount;
    student.pendingAmount = student.pendingAmount - paymentAmount;
    if (student.pendingAmount > 0) {
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      student.nextInstallmentDate = today.toISOString().split("T")[0];
      student.dueDate = student.nextInstallmentDate;
    } else {
      student.nextInstallmentDate = "";
    }
    const course = db.courses.find((c) => c.id === student.courseId);
    const batch = db.batches.find((b) => b.id === student.batchId);
    const newPayment: Payment = {
      id: `RCP-${10000 + db.payments.length + 1}`,
      studentId: student.id,
      studentName: student.name,
      courseName: course ? course.name : "N/A",
      batchName: batch ? batch.name : "N/A",
      amountPaid: paymentAmount,
      previousBalance: prevBalance,
      remainingBalance: student.pendingAmount,
      paymentMethod: paymentMethod || PaymentMethod.Cash,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      accountantName: accountantName || actor?.name || "Admin User",
      notes: notes || "Installment received",
    };
    db.payments.unshift(newPayment);
    addLog(db, "Payment Received", `Processed receipt ${newPayment.id} for ${student.name}.`, accountantName || actor?.name, UserRole.Accountant);
    await saveDB(db);
    return json({ success: true, payment: newPayment, student });
  }

  if (method === "GET" && match(pathname, "/admin/api/logs")) {
    const denied = requireAdmin();
    if (denied) return denied;
    return json(db.logs);
  }

  if (method === "GET" && match(pathname, "/admin/api/settings")) return json(db.settings);
  if (method === "PUT" && match(pathname, "/admin/api/settings")) {
    const denied = requireAdmin();
    if (denied) return denied;
    db.settings = { ...db.settings, ...(body as typeof db.settings) };
    await saveDB(db);
    return json({ success: true, settings: db.settings });
  }

  if (method === "GET" && match(pathname, "/admin/api/backups")) {
    const denied = requireAdmin();
    if (denied) return denied;
    return json([]);
  }
  if (method === "POST" && match(pathname, "/admin/api/backups")) {
    const denied = requireAdmin();
    if (denied) return denied;
    return json({ success: true, message: "Data is already saved in Neon. File backups are not used on Vercel." });
  }
  if (method === "POST" && match(pathname, "/admin/api/backups/restore")) {
    const denied = requireAdmin();
    if (denied) return denied;
    return json({ success: false, message: "File restore is not available on Vercel. Data lives in Neon." }, 400);
  }

  return json({ success: false, message: "Not found." }, 404);
}
