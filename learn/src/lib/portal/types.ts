export type PortalStudent = {
  id: string;
  adminStudentId: string;
  email: string;
  /** bcrypt hash (legacy plaintext migrated on next successful login) */
  password: string;
  name: string;
  fatherName: string;
  phone: string;
  cnic: string;
  cohort: string;
  enrolledCourseIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PortalDatabase = {
  students: PortalStudent[];
};

export type SafePortalStudent = Omit<PortalStudent, "password">;

export type PortalRole = "student" | "teacher";

export type PortalTeacher = {
  id: string;
  adminTeacherId?: string;
  email: string;
  password: string;
  name: string;
  roleTitle: string;
  assignedCourseIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SafePortalTeacher = Omit<PortalTeacher, "password">;

export type AssignmentStatus = "open" | "closed";

export type PortalAssignment = {
  id: string;
  courseId: string;
  title: string;
  instructions: string;
  dueDate: string;
  totalMarks: number;
  /** Default pass mark % for this assignment; falls back to course threshold */
  passThresholdPercent?: number;
  submissionTypes: Array<"written" | "url" | "file">;
  createdByTeacherId: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
};

/** Student-facing / teacher-facing submission lifecycle */
export type SubmissionStatus =
  | "pending"
  | "submitted"
  | "reviewed"
  | "resubmission_required";

export type PortalSubmissionAttempt = {
  id: string;
  attemptNumber: number;
  writtenText?: string;
  url?: string;
  fileId?: string;
  submittedAt: string;
  status: Exclude<SubmissionStatus, "pending">;
  obtainedMarks?: number;
  feedback?: string;
  gradedByTeacherId?: string;
  gradedAt?: string;
};

export type PortalSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  /** Mirrors latest attempt for fast queries */
  status: Exclude<SubmissionStatus, "pending">;
  writtenText?: string;
  url?: string;
  fileId?: string;
  obtainedMarks?: number;
  feedback?: string;
  gradedByTeacherId?: string;
  submittedAt: string;
  gradedAt?: string;
  attempts: PortalSubmissionAttempt[];
};

export type PortalAnnouncement = {
  id: string;
  title: string;
  body: string;
  courseId: string | "all";
  createdByTeacherId: string;
  createdAt: string;
};

export type PortalCertificate = {
  id: string;
  /** Public unique certificate code */
  certificateCode: string;
  studentId: string;
  courseId: string;
  title: string;
  issuedAt: string;
  issuedByTeacherId: string;
};

export type AttendanceStatus = "present" | "absent" | "late";

export type PortalAttendanceSession = {
  id: string;
  courseId: string;
  /** YYYY-MM-DD */
  date: string;
  label?: string;
  markedByTeacherId: string;
  createdAt: string;
  updatedAt: string;
  records: Array<{ studentId: string; status: AttendanceStatus }>;
};

export type PortalLessonCompletion = {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  completedAt: string;
};

export type PortalFileMeta = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  ownerId: string;
  ownerRole: "student" | "teacher";
  purpose: "submission" | "resource";
  courseId?: string;
  assignmentId?: string;
  createdAt: string;
  checksum?: string;
};

export type PortalCourseResource = {
  id: string;
  courseId: string;
  title: string;
  fileId: string;
  uploadedByTeacherId: string;
  createdAt: string;
};

export type InquiryStatus = "new" | "contacted" | "closed";

export type PortalInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestedCourse: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

export type PortalLmsDatabase = {
  assignments: PortalAssignment[];
  submissions: PortalSubmission[];
  announcements: PortalAnnouncement[];
  certificates: PortalCertificate[];
  lessonCompletions?: PortalLessonCompletion[];
  attendanceSessions?: PortalAttendanceSession[];
  files?: PortalFileMeta[];
  courseResources?: PortalCourseResource[];
};

export type TeachersDatabase = {
  teachers: PortalTeacher[];
};

export type InquiriesDatabase = {
  inquiries: PortalInquiry[];
};
