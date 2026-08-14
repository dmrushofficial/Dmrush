import fs from "fs";
import path from "path";
import type {
  AttendanceStatus,
  PortalAnnouncement,
  PortalAssignment,
  PortalAttendanceSession,
  PortalCertificate,
  PortalCourseResource,
  PortalLessonCompletion,
  PortalLmsDatabase,
  PortalSubmission,
  PortalSubmissionAttempt,
  PortalTeacher,
  TeachersDatabase,
} from "./types";
import { courses } from "@/content/courses";
import { hashPassword, isPasswordHashed } from "./password";

const DATA_DIR = path.join(process.cwd(), "data");
const TEACHERS_FILE = path.join(DATA_DIR, "portal-teachers.json");
const LMS_FILE = path.join(DATA_DIR, "portal-lms.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function defaultTeachers(): Promise<TeachersDatabase> {
  const now = new Date().toISOString();
  return {
    teachers: [
      {
        id: "PT-001",
        email: "teacher@dmrush.com",
        password: await hashPassword("teacher"),
        name: "DMRUSH Instructor",
        roleTitle: "Lead Instructor",
        assignedCourseIds: courses.map((c) => c.id),
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}

function emptyLms(): PortalLmsDatabase {
  return {
    assignments: [],
    submissions: [],
    announcements: [],
    certificates: [],
    lessonCompletions: [],
    attendanceSessions: [],
    files: [],
    courseResources: [],
  };
}

function normalizeSubmission(raw: PortalSubmission & { attempts?: PortalSubmissionAttempt[]; status?: string }): PortalSubmission {
  const rawStatus = String(raw.status || "submitted");
  const status: PortalSubmission["status"] =
    rawStatus === "graded" || rawStatus === "reviewed"
      ? "reviewed"
      : rawStatus === "returned" || rawStatus === "resubmission_required"
        ? "resubmission_required"
        : "submitted";

  let attempts = Array.isArray(raw.attempts) ? raw.attempts : [];
  if (attempts.length === 0) {
    attempts = [
      {
        id: `${raw.id}-a1`,
        attemptNumber: 1,
        writtenText: raw.writtenText,
        url: raw.url,
        fileId: raw.fileId,
        submittedAt: raw.submittedAt,
        status,
        obtainedMarks: raw.obtainedMarks,
        feedback: raw.feedback,
        gradedByTeacherId: raw.gradedByTeacherId,
        gradedAt: raw.gradedAt,
      },
    ];
  }

  return {
    ...raw,
    status,
    attempts,
  };
}

function normalizeLms(db: PortalLmsDatabase): PortalLmsDatabase {
  return {
    ...emptyLms(),
    ...db,
    lessonCompletions: db.lessonCompletions || [],
    attendanceSessions: db.attendanceSessions || [],
    files: db.files || [],
    courseResources: db.courseResources || [],
    submissions: (db.submissions || []).map((s) => normalizeSubmission(s as PortalSubmission)),
    certificates: (db.certificates || []).map((c) => ({
      ...c,
      certificateCode: c.certificateCode || c.id,
    })),
  };
}

export function readTeachersDb(): TeachersDatabase {
  ensureDir();
  if (!fs.existsSync(TEACHERS_FILE)) {
    // Sync seed with plaintext then migrate on first login if hash fails here —
    // write a placeholder; migrateTeachersPasswords called from login.
    const now = new Date().toISOString();
    const seed: TeachersDatabase = {
      teachers: [
        {
          id: "PT-001",
          email: "teacher@dmrush.com",
          password: "teacher",
          name: "DMRUSH Instructor",
          roleTitle: "Lead Instructor",
          assignedCourseIds: courses.map((c) => c.id),
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
    };
    fs.writeFileSync(TEACHERS_FILE, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
  return JSON.parse(fs.readFileSync(TEACHERS_FILE, "utf-8")) as TeachersDatabase;
}

export function writeTeachersDb(db: TeachersDatabase) {
  ensureDir();
  fs.writeFileSync(TEACHERS_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function findTeacherByEmail(email: string): PortalTeacher | undefined {
  const normalized = email.trim().toLowerCase();
  return readTeachersDb().teachers.find((t) => t.email.toLowerCase() === normalized && t.isActive);
}

export function findTeacherById(id: string): PortalTeacher | undefined {
  return readTeachersDb().teachers.find((t) => t.id === id && t.isActive);
}

export function findTeacherByAdminId(adminTeacherId: string): PortalTeacher | undefined {
  return readTeachersDb().teachers.find((t) => t.adminTeacherId === adminTeacherId);
}

export function upsertTeacher(teacher: PortalTeacher): PortalTeacher {
  const db = readTeachersDb();
  const idx = db.teachers.findIndex(
    (t) => t.id === teacher.id || (teacher.adminTeacherId && t.adminTeacherId === teacher.adminTeacherId),
  );
  if (idx === -1) db.teachers.unshift(teacher);
  else db.teachers[idx] = { ...db.teachers[idx], ...teacher };
  writeTeachersDb(db);
  return teacher;
}

export function deactivateTeacherByAdminId(adminTeacherId: string): boolean {
  const db = readTeachersDb();
  const idx = db.teachers.findIndex((t) => t.adminTeacherId === adminTeacherId);
  if (idx === -1) return false;
  db.teachers[idx] = {
    ...db.teachers[idx],
    isActive: false,
    updatedAt: new Date().toISOString(),
  };
  writeTeachersDb(db);
  return true;
}

export function updateTeacher(teacher: PortalTeacher): PortalTeacher {
  return upsertTeacher(teacher);
}

export function readLmsDb(): PortalLmsDatabase {
  ensureDir();
  if (!fs.existsSync(LMS_FILE)) {
    const empty = emptyLms();
    fs.writeFileSync(LMS_FILE, JSON.stringify(empty, null, 2), "utf-8");
    return empty;
  }
  const raw = JSON.parse(fs.readFileSync(LMS_FILE, "utf-8")) as PortalLmsDatabase;
  return normalizeLms(raw);
}

export function writeLmsDb(db: PortalLmsDatabase) {
  ensureDir();
  fs.writeFileSync(LMS_FILE, JSON.stringify(normalizeLms(db), null, 2), "utf-8");
}

export function listAssignments(): PortalAssignment[] {
  return readLmsDb().assignments;
}

export function getAssignment(id: string): PortalAssignment | undefined {
  return readLmsDb().assignments.find((a) => a.id === id);
}

export function upsertAssignment(assignment: PortalAssignment): PortalAssignment {
  const db = readLmsDb();
  const idx = db.assignments.findIndex((a) => a.id === assignment.id);
  if (idx === -1) db.assignments.unshift(assignment);
  else db.assignments[idx] = assignment;
  writeLmsDb(db);
  return assignment;
}

export function deleteAssignment(id: string) {
  const db = readLmsDb();
  db.assignments = db.assignments.filter((a) => a.id !== id);
  db.submissions = db.submissions.filter((s) => s.assignmentId !== id);
  writeLmsDb(db);
}

export function listSubmissions(): PortalSubmission[] {
  return readLmsDb().submissions.map((s) => normalizeSubmission(s));
}

export function getSubmission(id: string): PortalSubmission | undefined {
  const s = readLmsDb().submissions.find((x) => x.id === id);
  return s ? normalizeSubmission(s) : undefined;
}

export function findSubmission(assignmentId: string, studentId: string): PortalSubmission | undefined {
  const s = readLmsDb().submissions.find(
    (x) => x.assignmentId === assignmentId && x.studentId === studentId,
  );
  return s ? normalizeSubmission(s) : undefined;
}

export function upsertSubmission(submission: PortalSubmission): PortalSubmission {
  const normalized = normalizeSubmission(submission);
  const db = readLmsDb();
  const idx = db.submissions.findIndex((s) => s.id === normalized.id);
  if (idx === -1) db.submissions.unshift(normalized);
  else db.submissions[idx] = normalized;
  writeLmsDb(db);
  return normalized;
}

export function listAnnouncements(): PortalAnnouncement[] {
  return readLmsDb().announcements;
}

export function upsertAnnouncement(item: PortalAnnouncement): PortalAnnouncement {
  const db = readLmsDb();
  const idx = db.announcements.findIndex((a) => a.id === item.id);
  if (idx === -1) db.announcements.unshift(item);
  else db.announcements[idx] = item;
  writeLmsDb(db);
  return item;
}

export function deleteAnnouncement(id: string) {
  const db = readLmsDb();
  db.announcements = db.announcements.filter((a) => a.id !== id);
  writeLmsDb(db);
}

export function listCertificates(): PortalCertificate[] {
  return readLmsDb().certificates;
}

export function upsertCertificate(item: PortalCertificate): PortalCertificate {
  const db = readLmsDb();
  const idx = db.certificates.findIndex(
    (c) => c.studentId === item.studentId && c.courseId === item.courseId,
  );
  if (idx === -1) db.certificates.unshift(item);
  else db.certificates[idx] = item;
  writeLmsDb(db);
  return item;
}

export function listLessonCompletions(): PortalLessonCompletion[] {
  return readLmsDb().lessonCompletions || [];
}

export function markLessonComplete(input: {
  studentId: string;
  courseId: string;
  lessonId: string;
}): PortalLessonCompletion {
  const db = readLmsDb();
  db.lessonCompletions = db.lessonCompletions || [];
  const existing = db.lessonCompletions.find(
    (c) =>
      c.studentId === input.studentId &&
      c.courseId === input.courseId &&
      c.lessonId === input.lessonId,
  );
  if (existing) return existing;
  const row: PortalLessonCompletion = {
    id: newId("LC"),
    studentId: input.studentId,
    courseId: input.courseId,
    lessonId: input.lessonId,
    completedAt: new Date().toISOString(),
  };
  db.lessonCompletions.unshift(row);
  writeLmsDb(db);
  return row;
}

export function unmarkLessonComplete(studentId: string, courseId: string, lessonId: string) {
  const db = readLmsDb();
  db.lessonCompletions = (db.lessonCompletions || []).filter(
    (c) => !(c.studentId === studentId && c.courseId === courseId && c.lessonId === lessonId),
  );
  writeLmsDb(db);
}

export function listAttendanceSessions(): PortalAttendanceSession[] {
  return readLmsDb().attendanceSessions || [];
}

export function getAttendanceSession(id: string): PortalAttendanceSession | undefined {
  return listAttendanceSessions().find((s) => s.id === id);
}

export function upsertAttendanceSession(session: PortalAttendanceSession): PortalAttendanceSession {
  const db = readLmsDb();
  db.attendanceSessions = db.attendanceSessions || [];
  const idx = db.attendanceSessions.findIndex((s) => s.id === session.id);
  if (idx === -1) {
    const byDate = db.attendanceSessions.findIndex(
      (s) => s.courseId === session.courseId && s.date === session.date,
    );
    if (byDate !== -1) db.attendanceSessions[byDate] = session;
    else db.attendanceSessions.unshift(session);
  } else {
    db.attendanceSessions[idx] = session;
  }
  writeLmsDb(db);
  return session;
}

export function listCourseResources(courseId?: string): PortalCourseResource[] {
  const all = readLmsDb().courseResources || [];
  return courseId ? all.filter((r) => r.courseId === courseId) : all;
}

export function upsertCourseResource(item: PortalCourseResource): PortalCourseResource {
  const db = readLmsDb();
  db.courseResources = db.courseResources || [];
  const idx = db.courseResources.findIndex((r) => r.id === item.id);
  if (idx === -1) db.courseResources.unshift(item);
  else db.courseResources[idx] = item;
  writeLmsDb(db);
  return item;
}

export function deleteCourseResource(id: string) {
  const db = readLmsDb();
  db.courseResources = (db.courseResources || []).filter((r) => r.id !== id);
  writeLmsDb(db);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function newCertificateCode(): string {
  return `DMRUSH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Rehash plaintext teacher password after successful login */
export async function migrateTeacherPasswordIfNeeded(teacherId: string, plaintext: string) {
  const db = readTeachersDb();
  const idx = db.teachers.findIndex((t) => t.id === teacherId);
  if (idx === -1) return;
  if (isPasswordHashed(db.teachers[idx].password)) return;
  db.teachers[idx].password = await hashPassword(plaintext);
  db.teachers[idx].updatedAt = new Date().toISOString();
  writeTeachersDb(db);
}

export type { AttendanceStatus };
// silence unused defaultTeachers for now
void defaultTeachers;
