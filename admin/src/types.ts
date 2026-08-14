export enum Shift {
  Morning = "Morning",
  Evening = "Evening",
  Weekend = "Weekend"
}

export enum StudentStatus {
  Active = "Active",
  Completed = "Completed",
  Dropped = "Dropped",
  OnHold = "On Hold",
  Archived = "Archived"
}

export enum CourseStatus {
  Active = "Active",
  Inactive = "Inactive"
}

export enum BatchStatus {
  Active = "Active",
  Completed = "Completed",
  Upcoming = "Upcoming"
}

export enum LeadSource {
  Facebook = "Facebook",
  Instagram = "Instagram",
  WalkIn = "Walk-in",
  Referral = "Referral",
  WhatsApp = "WhatsApp",
  Website = "Website"
}

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Interested = "Interested",
  FollowUp = "Follow-up",
  Converted = "Converted",
  Closed = "Closed"
}

export enum PaymentMethod {
  Cash = "Cash",
  BankTransfer = "Bank Transfer",
  JazzCash = "JazzCash",
  EasyPaisa = "EasyPaisa"
}

export enum UserRole {
  Admin = "Admin",
  Accountant = "Accountant"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  password?: string;
}

export interface Student {
  id: string; // Auto-generated ID (e.g. DM-2026-001)
  name: string;
  fatherName: string;
  cnic: string;
  phone: string;
  email: string;
  admissionDate: string;
  courseId: string;
  batchId: string;
  shift: Shift;
  startDate: string;
  endDate: string;
  duration: string; // e.g. "3 Months"
  status: StudentStatus;
  notes: string;
  
  // Fee Structure
  totalFee: number;
  discount: number;
  paidAmount: number;
  pendingAmount: number; // remaining balance
  dueDate: string;
  nextInstallmentDate: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  totalFee: number;
  description: string;
  status: CourseStatus;
  /** Learn portal course id (e.g. course-global-seo) for auto-enrollment */
  portalCourseId?: string;
  classesPerWeek?: number;
  days?: string;
  classTime?: string;
}

export interface Batch {
  id: string;
  courseId: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: BatchStatus;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestedCourseId: string;
  source: LeadSource;
  notes: string;
  followUpDate: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Payment {
  id: string; // receipt number e.g. RCP-10001
  studentId: string;
  studentName: string;
  courseName: string;
  batchName: string;
  amountPaid: number;
  previousBalance: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentTime: string;
  accountantName: string;
  notes: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  date: string;
  time: string;
  ipAddress: string;
}

export interface Backup {
  fileName: string;
  createdAt: string;
  size: string;
}

export interface Settings {
  instituteName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  timezone: string;
  receiptNote: string;
}

/** Instructor accounts synced to Learn teacher portal */
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  /** Admin course IDs (C-101…) — mapped to portalCourseId on provision */
  courseIds: string[];
  isActive: boolean;
  createdAt: string;
  /** Last known portal password shown once after create/reset (not re-fetched) */
  lastPortalPassword?: string;
}
