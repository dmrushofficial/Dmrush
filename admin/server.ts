import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  Student, Course, Batch, Inquiry, Payment, ActivityLog, Settings, 
  User, UserRole, Shift, StudentStatus, CourseStatus, BatchStatus, LeadSource, LeadStatus, PaymentMethod,
  Teacher,
} from "./src/types.js";
import {
  AuthedRequest,
  SESSION_COOKIE,
  createSession,
  destroySession,
  getSessionUserId,
  requireAdmin,
  requireAuth,
  sanitizeUser,
  sessionCookieOptions,
} from "./src/auth.js";
import {
  provisionStudentPortal,
  resetStudentPortalPassword,
  syncStudentPortal,
  provisionTeacherPortal,
  deleteTeacherPortal,
  resetTeacherPortalPassword,
} from "./src/portal-sync.js";

const app = express();
const PORT = Number(process.env.ADMIN_PORT || process.env.PORT || 3005);

app.use(express.json());
app.use(cookieParser());

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Initial rich dummy database
const INITIAL_DATABASE = {
  users: [
    { id: "U-1", name: "Admin User", email: "admin@dmrush.com", role: UserRole.Admin, isActive: true, password: "admin" },
    { id: "U-2", name: "Accountant User", email: "accountant@dmrush.com", role: UserRole.Accountant, isActive: true, password: "accountant" }
  ] as User[],
  courses: [
    { id: "C-101", name: "Global SEO Mastery", duration: "3 Months", totalFee: 30000, description: "Build compounding organic visibility with technical SEO, content systems, and authority.", status: CourseStatus.Active, portalCourseId: "course-global-seo", classesPerWeek: 3, days: "Mon/Wed/Sat", classTime: "12:00–1:30" },
    { id: "C-102", name: "Local SEO Mastery", duration: "3 Months", totalFee: 30000, description: "Win nearby demand with Maps, Google Business Profile, and location-focused pages.", status: CourseStatus.Active, portalCourseId: "course-local-seo", classesPerWeek: 3, days: "Mon/Wed/Sat", classTime: "1:30–3:00" },
    { id: "C-103", name: "Shopify & E-Commerce", duration: "2 Months", totalFee: 25000, description: "Build and optimize Shopify stores for product clarity, checkout flow, and growth.", status: CourseStatus.Active, portalCourseId: "course-shopify", classesPerWeek: 3, days: "Mon/Wed/Sat", classTime: "3:00–4:30" },
    { id: "C-104", name: "WordPress Website Development", duration: "3 Months", totalFee: 30000, description: "Build professional WordPress websites with clean structure, SEO foundations, and conversion focus.", status: CourseStatus.Active, portalCourseId: "course-wordpress", classesPerWeek: 3, days: "Mon/Wed/Sat", classTime: "4:30–6:00" },
    { id: "C-105", name: "AI Tools & Prompt Engineering", duration: "2 Months", totalFee: 20000, description: "Use modern AI tools with structured prompts for marketing and production work.", status: CourseStatus.Active, portalCourseId: "course-ai-tools", classesPerWeek: 3, days: "Tue/Thu/Sun", classTime: "12:00–1:30" },
    { id: "C-106", name: "SaaS-Based AI Tools", duration: "1 Month", totalFee: 15000, description: "Apply SaaS AI platforms for research, content, automation, and team workflows.", status: CourseStatus.Active, portalCourseId: "course-saas-ai", classesPerWeek: 3, days: "Tue/Thu/Sun", classTime: "1:30–3:00" },
    { id: "C-107", name: "Digital Marketing", duration: "2 Months", totalFee: 25000, description: "Plan and run digital marketing across search, social, content, and paid channels.", status: CourseStatus.Active, portalCourseId: "course-digital-marketing", classesPerWeek: 3, days: "Tue/Thu/Sun", classTime: "3:00–4:30" },
    { id: "C-108", name: "AI Website Building", duration: "1 Month", totalFee: 15000, description: "Design and ship modern websites faster with AI-assisted workflows.", status: CourseStatus.Active, portalCourseId: "course-ai-website", classesPerWeek: 2, days: "Tue/Thu", classTime: "4:30–6:00" }
  ] as Course[],
  batches: [
    { id: "B-101", courseId: "C-101", name: "GSEO-MWS-1200", startDate: "2026-08-01", endDate: "2026-11-01", capacity: 25, status: BatchStatus.Active },
    { id: "B-102", courseId: "C-102", name: "LSEO-MWS-1330", startDate: "2026-08-01", endDate: "2026-11-01", capacity: 25, status: BatchStatus.Active },
    { id: "B-103", courseId: "C-103", name: "SHOP-MWS-1500", startDate: "2026-08-01", endDate: "2026-10-01", capacity: 20, status: BatchStatus.Active },
    { id: "B-104", courseId: "C-104", name: "WP-MWS-1630", startDate: "2026-08-01", endDate: "2026-11-01", capacity: 20, status: BatchStatus.Active },
    { id: "B-105", courseId: "C-105", name: "AITOOLS-TTS-1200", startDate: "2026-08-01", endDate: "2026-10-01", capacity: 25, status: BatchStatus.Active },
    { id: "B-106", courseId: "C-106", name: "SAASAI-TTS-1330", startDate: "2026-08-01", endDate: "2026-09-01", capacity: 20, status: BatchStatus.Active },
    { id: "B-107", courseId: "C-107", name: "DMKT-TTS-1500", startDate: "2026-08-01", endDate: "2026-10-01", capacity: 25, status: BatchStatus.Active },
    { id: "B-108", courseId: "C-108", name: "AIWEB-TT-1630", startDate: "2026-08-01", endDate: "2026-09-01", capacity: 20, status: BatchStatus.Active }
  ] as Batch[],
  students: [
    {
      id: "DM-2026-001",
      name: "Hamza Ahmed",
      fatherName: "Muhammad Ahmed",
      cnic: "42101-1234567-1",
      phone: "0300-1234567",
      email: "hamza@example.com",
      admissionDate: "2026-01-10",
      courseId: "C-101",
      batchId: "B-101",
      shift: Shift.Morning,
      startDate: "2026-01-10",
      endDate: "2026-07-10",
      duration: "6 Months",
      status: StudentStatus.Active,
      notes: "Bright student, paying on time in installments.",
      totalFee: 45000,
      discount: 3000,
      paidAmount: 30000,
      pendingAmount: 12000,
      dueDate: "2026-07-25",
      nextInstallmentDate: "2026-07-25"
    },
    {
      id: "DM-2026-002",
      name: "Ayesha Khan",
      fatherName: "Sajid Khan",
      cnic: "42101-7654321-2",
      phone: "0311-9876543",
      email: "ayesha.k@example.com",
      admissionDate: "2026-02-15",
      courseId: "C-102",
      batchId: "B-103",
      shift: Shift.Evening,
      startDate: "2026-02-15",
      endDate: "2026-05-15",
      duration: "3 Months",
      status: StudentStatus.Completed,
      notes: "Completed course with outstanding grades and projects.",
      totalFee: 25000,
      discount: 0,
      paidAmount: 25000,
      pendingAmount: 0,
      dueDate: "2026-05-15",
      nextInstallmentDate: ""
    },
    {
      id: "DM-2026-003",
      name: "Zain Ali",
      fatherName: "Amjad Ali",
      cnic: "42201-4455667-3",
      phone: "0321-1122334",
      email: "zain.ali@example.com",
      admissionDate: "2026-01-12",
      courseId: "C-101",
      batchId: "B-101",
      shift: Shift.Weekend,
      startDate: "2026-01-10",
      endDate: "2026-07-10",
      duration: "6 Months",
      status: StudentStatus.Active,
      notes: "Requires backup classes occasionally due to work commitments.",
      totalFee: 45000,
      discount: 5000,
      paidAmount: 40000,
      pendingAmount: 0,
      dueDate: "2026-06-10",
      nextInstallmentDate: ""
    },
    {
      id: "DM-2026-004",
      name: "Fatima Raza",
      fatherName: "Syed Raza",
      cnic: "42301-8899001-4",
      phone: "0333-5556677",
      email: "fatima.r@example.com",
      admissionDate: "2026-05-01",
      courseId: "C-103",
      batchId: "B-104",
      shift: Shift.Morning,
      startDate: "2026-05-01",
      endDate: "2026-09-01",
      duration: "4 Months",
      status: StudentStatus.Active,
      notes: "Wants weekly updates. Installment payment due date requested extensions.",
      totalFee: 35000,
      discount: 2000,
      paidAmount: 15000,
      pendingAmount: 18000,
      dueDate: "2026-07-10",
      nextInstallmentDate: "2026-07-10"
    },
    {
      id: "DM-2026-005",
      name: "Bilal Siddiqui",
      fatherName: "Anwar Siddiqui",
      cnic: "42101-5566778-5",
      phone: "0345-4433221",
      email: "bilal.s@example.com",
      admissionDate: "2026-07-02",
      courseId: "C-104",
      batchId: "B-105",
      shift: Shift.Evening,
      startDate: "2026-07-01",
      endDate: "2026-10-01",
      duration: "3 Months",
      status: StudentStatus.Active,
      notes: "Admitted via Instagram Lead campaign.",
      totalFee: 20000,
      discount: 1000,
      paidAmount: 19000,
      pendingAmount: 0,
      dueDate: "2026-07-02",
      nextInstallmentDate: ""
    },
    {
      id: "DM-2026-006",
      name: "Kiran Shah",
      fatherName: "Asif Shah",
      cnic: "42101-2233445-6",
      phone: "0301-7788990",
      email: "kiran@example.com",
      admissionDate: "2026-02-15",
      courseId: "C-102",
      batchId: "B-103",
      shift: Shift.Evening,
      startDate: "2026-02-15",
      endDate: "2026-05-15",
      status: StudentStatus.Dropped,
      notes: "Dropped due to family relocation to Islamabad.",
      totalFee: 25000,
      discount: 0,
      paidAmount: 10000,
      pendingAmount: 15000,
      dueDate: "2026-03-15",
      nextInstallmentDate: ""
    }
  ] as Student[],
  inquiries: [
    { id: "L-101", name: "Usman Ghani", phone: "0300-8889991", email: "usman.g@example.com", interestedCourseId: "C-101", source: LeadSource.Facebook, notes: "Inquired about full stack batch installments. Follow up scheduled.", followUpDate: "2026-07-22", status: LeadStatus.Interested, createdAt: "2026-07-15T10:30:00Z" },
    { id: "L-102", name: "Sana Malik", phone: "0312-3334442", email: "sana.m@example.com", interestedCourseId: "C-102", source: LeadSource.WalkIn, notes: "Visited campus physically. Requested a tour and layout plan.", followUpDate: "2026-07-23", status: LeadStatus.FollowUp, createdAt: "2026-07-18T14:15:00Z" },
    { id: "L-103", name: "Asad Mahmood", phone: "0321-7778883", email: "asad.m@example.com", interestedCourseId: "C-103", source: LeadSource.Website, notes: "Submitted online query form for iOS/Android app course.", followUpDate: "2026-07-24", status: LeadStatus.New, createdAt: "2026-07-20T08:00:00Z" },
    { id: "L-104", name: "Zoya Butt", phone: "0333-1112224", email: "zoya@example.com", interestedCourseId: "C-104", source: LeadSource.Instagram, notes: "Shared digital marketing brochure on whatsapp.", followUpDate: "2026-07-19", status: LeadStatus.Contacted, createdAt: "2026-07-10T12:00:00Z" }
  ] as Inquiry[],
  payments: [
    { id: "RCP-10001", studentId: "DM-2026-001", studentName: "Hamza Ahmed", courseName: "Full Stack Web Development", batchName: "FSWD-2026-BatchA", amountPaid: 15000, previousBalance: 42000, remainingBalance: 27000, paymentMethod: PaymentMethod.Cash, paymentDate: "2026-01-10", paymentTime: "11:30 AM", accountantName: "Accountant User", notes: "Admission & Registration Fee" },
    { id: "RCP-10002", studentId: "DM-2026-001", studentName: "Hamza Ahmed", courseName: "Full Stack Web Development", batchName: "FSWD-2026-BatchA", amountPaid: 15000, previousBalance: 27000, remainingBalance: 12000, paymentMethod: PaymentMethod.BankTransfer, paymentDate: "2026-04-12", paymentTime: "02:15 PM", accountantName: "Accountant User", notes: "Second Installment payment" },
    { id: "RCP-10003", studentId: "DM-2026-002", studentName: "Ayesha Khan", courseName: "UI/UX Graphic Design", batchName: "UIUX-2026-BatchA", amountPaid: 25000, previousBalance: 25000, remainingBalance: 0, paymentMethod: PaymentMethod.JazzCash, paymentDate: "2026-02-15", paymentTime: "04:45 PM", accountantName: "Accountant User", notes: "Full Lumsum Payment with Admission" },
    { id: "RCP-10004", studentId: "DM-2026-003", studentName: "Zain Ali", courseName: "Full Stack Web Development", batchName: "FSWD-2026-BatchA", amountPaid: 40000, previousBalance: 40000, remainingBalance: 0, paymentMethod: PaymentMethod.EasyPaisa, paymentDate: "2026-01-12", paymentTime: "01:00 PM", accountantName: "Accountant User", notes: "Complete payment after discounted total" },
    { id: "RCP-10005", studentId: "DM-2026-004", studentName: "Fatima Raza", courseName: "Mobile App Development", batchName: "ANDR-2026-BatchA", amountPaid: 15000, previousBalance: 33000, remainingBalance: 18000, paymentMethod: PaymentMethod.Cash, paymentDate: "2026-05-01", paymentTime: "10:00 AM", accountantName: "Accountant User", notes: "Down payment of mobile admission" },
    { id: "RCP-10006", studentId: "DM-2026-005", studentName: "Bilal Siddiqui", courseName: "Digital Marketing & SEO", batchName: "DMKT-2026-BatchA", amountPaid: 19000, previousBalance: 19000, remainingBalance: 0, paymentMethod: PaymentMethod.BankTransfer, paymentDate: "2026-07-02", paymentTime: "03:20 PM", accountantName: "Accountant User", notes: "Full course fee received" }
  ] as Payment[],
  logs: [
    { id: "LOG-1", user: "Admin User", role: UserRole.Admin, action: "System Initialized", details: "Database booted up with high-fidelity dummy data sets.", date: "2026-07-21", time: "01:00 AM", ipAddress: "127.0.0.1" },
    { id: "LOG-2", user: "Admin User", role: UserRole.Admin, action: "Student Admitted", details: "Admitted Hamza Ahmed into Full Stack Web Development.", date: "2026-01-10", time: "11:30 AM", ipAddress: "127.0.0.1" },
    { id: "LOG-3", user: "Accountant User", role: UserRole.Accountant, action: "Payment Received", details: "Generated RCP-10001 for Hamza Ahmed. Received PKR 15,000 Cash.", date: "2026-01-10", time: "11:35 AM", ipAddress: "192.168.1.15" }
  ] as ActivityLog[],
  settings: {
    instituteName: "DM Rush Institute",
    logoUrl: "",
    address: "Flat 101 Burj Al Ghauri Plaza, Faisal Colony Pattoki.",
    phone: "+92 301 7786667",
    email: "info@dmrush.edu.pk",
    currency: "PKR",
    timezone: "PKT (UTC+5)",
    receiptNote: "Thank you for choosing DM Rush. Please note that fees once paid are non-refundable and non-transferable."
  } as Settings,
  teachers: [
    {
      id: "TCH-NAJAF",
      name: "Najaf Khan",
      email: "najaf.khan@dmrush.com",
      phone: "",
      roleTitle: "SEO & Digital Marketing Instructor",
      courseIds: ["C-101", "C-102", "C-107"],
      isActive: true,
      createdAt: "2026-08-15T00:00:00.000Z",
      photoUrl: "/instructors/najaf-khan.png",
    },
    {
      id: "TCH-USMAN",
      name: "Usman Raza",
      email: "usman.raza@dmrush.com",
      phone: "",
      roleTitle: "Web & Ecommerce Instructor",
      courseIds: ["C-103", "C-104", "C-108"],
      isActive: true,
      createdAt: "2026-08-15T00:00:00.000Z",
      photoUrl: "/instructors/usman-raza.png",
    },
    {
      id: "TCH-TAYYAB",
      name: "Tayyab Hanif",
      email: "tayyab.hanif@dmrush.com",
      phone: "",
      roleTitle: "AI Tools Instructor",
      courseIds: ["C-105", "C-106"],
      isActive: true,
      createdAt: "2026-08-15T00:00:00.000Z",
      photoUrl: "/instructors/tayyab-hanif.png",
    },
  ] as Teacher[],
};

// Database utility helpers
function readDB(): typeof INITIAL_DATABASE {
  if (!fs.existsSync(DB_FILE)) {
    writeDB(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const db = JSON.parse(raw);
    
    // Auto-migrate missing passwords for users
    let modified = false;
    if (db && Array.isArray(db.users)) {
      db.users = db.users.map((u: any) => {
        if (!u.password) {
          modified = true;
          return {
            ...u,
            password: u.role === UserRole.Admin ? "admin" : "accountant"
          };
        }
        return u;
      });
    }

    if (!db.teachers || !Array.isArray(db.teachers)) {
      db.teachers = [];
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
    return db;
  } catch (err) {
    console.error("Failed to read database, resetting to initial state", err);
    writeDB(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }
}

function writeDB(data: typeof INITIAL_DATABASE) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function addLog(action: string, details: string, user = "Admin User", role = UserRole.Admin) {
  const db = readDB();
  const timeStr = new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = new Date().toISOString().split('T')[0];
  const newLog: ActivityLog = {
    id: `LOG-${Date.now()}`,
    user,
    role,
    action,
    details,
    date: dateStr,
    time: timeStr,
    ipAddress: "127.0.0.1" // Mock IP
  };
  db.logs.unshift(newLog);
  // Keep logs at a reasonable limit
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  writeDB(db);
}

// REST API ROUTES
const findUserById = (id: string): User | undefined => readDB().users.find((u) => u.id === id);
const authGuard = requireAuth(findUserById);

// Public auth endpoints (must be registered before the global /admin/api auth guard)
app.post("/admin/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const db = readDB();
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      u.isActive,
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password credentials." });
  }

  // Invalidate previous cookie session id if present, then issue a new one
  destroySession(req.cookies?.[SESSION_COOKIE]);
  const token = createSession(user.id);
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  addLog("User Logged In", `Logged in successfully via ${email}`, user.name, user.role);
  return res.json({ success: true, user: sanitizeUser(user) });
});

app.post("/admin/api/auth/logout", (req, res) => {
  destroySession(req.cookies?.[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE, { path: "/admin", httpOnly: true, sameSite: "lax" });
  return res.json({ success: true });
});

app.get("/admin/api/auth/me", authGuard, (req, res) => {
  return res.json({ success: true, user: (req as AuthedRequest).adminUser });
});

app.post("/admin/api/auth/switch-role", authGuard, requireAdmin, (req, res) => {
  const { role } = req.body || {};
  if (role !== UserRole.Admin && role !== UserRole.Accountant) {
    return res.status(400).json({ success: false, message: "Invalid role." });
  }
  const db = readDB();
  const target = db.users.find((u) => u.role === role && u.isActive);
  if (!target) {
    return res.status(404).json({ success: false, message: "Target user not found." });
  }

  destroySession(req.cookies?.[SESSION_COOKIE]);
  const token = createSession(target.id);
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  const actor = (req as AuthedRequest).adminUser;
  addLog(
    "Role Switch",
    `Switched active session to ${target.role} (${target.email}).`,
    actor?.name || "Admin User",
    UserRole.Admin,
  );
  return res.json({ success: true, user: sanitizeUser(target) });
});

// All remaining /admin/api/* routes require an authenticated session
app.use("/admin/api", authGuard);

// Users management endpoints (Admin only — never return password fields)
app.get("/admin/api/users", requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.users.map(sanitizeUser));
});

app.put("/admin/api/users/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { email, password, name } = req.body || {};
  const db = readDB();
  const userIndex = db.users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (typeof email === "string") db.users[userIndex].email = email;
  if (typeof name === "string") db.users[userIndex].name = name;
  // Only update password when a non-empty value is provided
  if (typeof password === "string" && password.length > 0) {
    db.users[userIndex].password = password;
  }

  writeDB(db);
  const actor = (req as AuthedRequest).adminUser;
  addLog(
    "User Updated",
    `Admin updated profile/credentials of ${db.users[userIndex].name} (${db.users[userIndex].role}).`,
    actor?.name || "Admin User",
    UserRole.Admin,
  );
  res.json({ success: true, user: sanitizeUser(db.users[userIndex]) });
});

// Reset database trigger (Admin only)
app.post("/admin/api/db/reset", requireAdmin, (req, res) => {
  writeDB(INITIAL_DATABASE);
  addLog("Database Reset", "Database was restored to default initial state.", "System", UserRole.Admin);
  res.json({ success: true, message: "Database successfully reset to initial default state." });
});

// Students API
app.get("/admin/api/students", (req, res) => {
  const db = readDB();
  res.json(db.students);
});

app.post("/admin/api/students", async (req, res) => {
  const db = readDB();
  const studentData: Partial<Student> = req.body;
  
  // Generate sequential Student ID based on year and counter
  const year = new Date().getFullYear();
  const activeCount = db.students.length + 1;
  const idStr = String(activeCount).padStart(3, '0');
  const studentId = `DM-${year}-${idStr}`;
  
  const newStudent: Student = {
    id: studentId,
    name: studentData.name || "Unknown",
    fatherName: studentData.fatherName || "",
    cnic: studentData.cnic || "",
    phone: studentData.phone || "",
    email: studentData.email || "",
    admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
    courseId: studentData.courseId || "",
    batchId: studentData.batchId || "",
    shift: studentData.shift || Shift.Morning,
    startDate: studentData.startDate || "",
    endDate: studentData.endDate || "",
    duration: studentData.duration || "3 Months",
    status: studentData.status || StudentStatus.Active,
    notes: studentData.notes || "",
    
    // Fee variables
    totalFee: Number(studentData.totalFee) || 0,
    discount: Number(studentData.discount) || 0,
    paidAmount: Number(studentData.paidAmount) || 0,
    pendingAmount: (Number(studentData.totalFee) || 0) - (Number(studentData.discount) || 0) - (Number(studentData.paidAmount) || 0),
    dueDate: studentData.dueDate || "",
    nextInstallmentDate: studentData.nextInstallmentDate || ""
  };
  
  db.students.unshift(newStudent);
  writeDB(db);
  
  // Create first payment receipt if there is a paid amount
  if (newStudent.paidAmount > 0) {
    const course = db.courses.find(c => c.id === newStudent.courseId);
    const batch = db.batches.find(b => b.id === newStudent.batchId);
    const receiptId = `RCP-${10000 + db.payments.length + 1}`;
    
    const initialPayment: Payment = {
      id: receiptId,
      studentId: newStudent.id,
      studentName: newStudent.name,
      courseName: course ? course.name : "N/A",
      batchName: batch ? batch.name : "N/A",
      amountPaid: newStudent.paidAmount,
      previousBalance: newStudent.totalFee - newStudent.discount,
      remainingBalance: newStudent.pendingAmount,
      paymentMethod: PaymentMethod.Cash,
      paymentDate: newStudent.admissionDate,
      paymentTime: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
      accountantName: "Admin User",
      notes: "Admission Down-payment received during registration"
    };
    db.payments.unshift(initialPayment);
    writeDB(db);
  }
  
  addLog("Student Admitted", `Registered ${newStudent.name} (ID: ${newStudent.id}) and initialized financial ledger.`, "Admin User", UserRole.Admin);

  const course = db.courses.find((c) => c.id === newStudent.courseId);
  const batch = db.batches.find((b) => b.id === newStudent.batchId);
  const portalAccount = await provisionStudentPortal(newStudent, course, batch?.name);
  if (portalAccount.provisioned) {
    addLog(
      "Portal Account",
      `Student portal access created for ${newStudent.email} (${course?.name || "course"}).`,
      "System",
      UserRole.Admin,
    );
  }

  res.json({ success: true, student: newStudent, portalAccount });
});

app.put("/admin/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.students.findIndex(s => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Student record not found." });
  }
  
  const updatedData = req.body;
  const oldStudent = db.students[index];
  
  // Recalculate pending billing
  const totalFee = Number(updatedData.totalFee !== undefined ? updatedData.totalFee : oldStudent.totalFee);
  const discount = Number(updatedData.discount !== undefined ? updatedData.discount : oldStudent.discount);
  const paidAmount = Number(updatedData.paidAmount !== undefined ? updatedData.paidAmount : oldStudent.paidAmount);
  const pendingAmount = totalFee - discount - paidAmount;
  
  db.students[index] = {
    ...oldStudent,
    ...updatedData,
    totalFee,
    discount,
    paidAmount,
    pendingAmount
  };
  
  writeDB(db);
  addLog("Student Updated", `Modified records for student ${db.students[index].name} (ID: ${id}).`, "Admin User", UserRole.Admin);

  const updatedStudent = db.students[index];
  const course = db.courses.find((c) => c.id === updatedStudent.courseId);
  const batch = db.batches.find((b) => b.id === updatedStudent.batchId);
  await syncStudentPortal(updatedStudent, course, batch?.name);

  res.json({ success: true, student: updatedStudent });
});

app.post("/admin/api/students/:id/portal-reset-password", async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const student = db.students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  const result = await resetStudentPortalPassword(id);
  if (!result.success) {
    return res.status(400).json(result);
  }
  addLog(
    "Portal Password Reset",
    `Reset Learn portal password for ${student.email}.`,
    (req as AuthedRequest).adminUser?.name || "Admin User",
    UserRole.Admin,
  );
  return res.json({
    success: true,
    portalAccount: {
      provisioned: true,
      email: result.email,
      initialPassword: result.initialPassword,
      loginUrl: result.loginUrl,
    },
  });
});

app.delete("/admin/api/students/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const student = db.students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({ success: false, message: "Student record not found." });
  }
  
  db.students = db.students.filter(s => s.id !== id);
  writeDB(db);
  addLog("Student Deleted", `Permanently deleted student profile of ${student.name} (ID: ${id}) and purged record.`, "Admin User", UserRole.Admin);
  res.json({ success: true, message: "Student record permanently deleted." });
});

function mapCourseIdsToPortalIds(courseIds: string[]): string[] {
  const db = readDB();
  return courseIds
    .map((id) => db.courses.find((c) => c.id === id)?.portalCourseId)
    .filter((id): id is string => Boolean(id));
}

// Teachers API (Learn portal instructors)
app.get("/admin/api/teachers", (req, res) => {
  const db = readDB();
  res.json(db.teachers || []);
});

app.post("/admin/api/teachers", requireAdmin, async (req, res) => {
  const db = readDB();
  const { name, email, phone, roleTitle, courseIds, password, isActive } = req.body || {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ success: false, message: "Name and email are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if ((db.teachers || []).some((t) => t.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ success: false, message: "A teacher with this email already exists." });
  }

  const id = `TCH-${Date.now().toString(36).toUpperCase()}`;
  const teacher: Teacher = {
    id,
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
    assignedCourseIds: mapCourseIdsToPortalIds(teacher.courseIds),
    isActive: teacher.isActive,
  });

  if (portal.provisioned === false) {
    return res.status(502).json({
      success: false,
      message: portal.reason,
    });
  }

  if (portal.initialPassword) {
    teacher.lastPortalPassword = portal.initialPassword;
  }

  db.teachers = db.teachers || [];
  db.teachers.unshift(teacher);
  writeDB(db);
  addLog(
    "Teacher Added",
    `Created teacher ${teacher.name} (${teacher.email}) for Learn portal.`,
    (req as AuthedRequest).adminUser?.name || "Admin User",
    UserRole.Admin,
  );

  res.json({
    success: true,
    teacher,
    portalAccount: {
      provisioned: true,
      created: portal.created,
      email: portal.email,
      initialPassword: portal.initialPassword,
      loginUrl: portal.loginUrl,
    },
  });
});

app.put("/admin/api/teachers/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = (db.teachers || []).findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Teacher not found." });
  }

  const prev = db.teachers[idx];
  const { name, email, phone, roleTitle, courseIds, password, isActive } = req.body || {};
  const nextEmail = email ? String(email).trim().toLowerCase() : prev.email;
  if (
    db.teachers.some(
      (t) => t.id !== id && t.email.toLowerCase() === nextEmail,
    )
  ) {
    return res.status(409).json({ success: false, message: "Email already used by another teacher." });
  }

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
    assignedCourseIds: mapCourseIdsToPortalIds(updated.courseIds),
    isActive: updated.isActive,
  });
  if (portal.provisioned === false) {
    return res.status(502).json({ success: false, message: portal.reason });
  }
  if (portal.initialPassword) {
    updated.lastPortalPassword = portal.initialPassword;
  }

  db.teachers[idx] = updated;
  writeDB(db);
  addLog(
    "Teacher Updated",
    `Updated teacher ${updated.name} (${updated.email}).`,
    (req as AuthedRequest).adminUser?.name || "Admin User",
    UserRole.Admin,
  );
  res.json({ success: true, teacher: updated });
});

app.post("/admin/api/teachers/:id/portal-reset-password", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const teacher = (db.teachers || []).find((t) => t.id === id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: "Teacher not found." });
  }
  const password =
    typeof req.body?.password === "string" && req.body.password.trim()
      ? req.body.password.trim()
      : undefined;
  const result = await resetTeacherPortalPassword(teacher.id, password);
  if (result.success === false) {
    return res.status(502).json({ success: false, message: result.message });
  }
  teacher.lastPortalPassword = result.initialPassword;
  writeDB(db);
  addLog(
    "Teacher Password Reset",
    `Reset Learn portal password for ${teacher.email}.`,
    (req as AuthedRequest).adminUser?.name || "Admin User",
    UserRole.Admin,
  );
  res.json({
    success: true,
    portalAccount: {
      provisioned: true,
      email: result.email,
      initialPassword: result.initialPassword,
      loginUrl: result.loginUrl,
    },
  });
});

app.delete("/admin/api/teachers/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const teacher = (db.teachers || []).find((t) => t.id === id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: "Teacher not found." });
  }
  await deleteTeacherPortal(teacher.id);
  db.teachers = (db.teachers || []).filter((t) => t.id !== id);
  writeDB(db);
  addLog(
    "Teacher Deleted",
    `Deleted teacher ${teacher.name} (${teacher.email}) and deactivated portal login.`,
    (req as AuthedRequest).adminUser?.name || "Admin User",
    UserRole.Admin,
  );
  res.json({ success: true });
});

// Courses API
app.get("/admin/api/courses", (req, res) => {
  const db = readDB();
  res.json(db.courses);
});

app.post("/admin/api/courses", (req, res) => {
  const db = readDB();
  const { name, duration, totalFee, description, status } = req.body;
  
  const newCourse: Course = {
    id: `C-${100 + db.courses.length + 1}`,
    name: name || "New Course",
    duration: duration || "3 Months",
    totalFee: Number(totalFee) || 0,
    description: description || "",
    status: status || CourseStatus.Active
  };
  
  db.courses.push(newCourse);
  writeDB(db);
  addLog("Course Created", `Added new course: ${newCourse.name} with total fee structure ${newCourse.totalFee} PKR.`, "Admin User", UserRole.Admin);
  res.json({ success: true, course: newCourse });
});

app.put("/admin/api/courses/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.courses.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "Course not found" });
  
  db.courses[index] = { ...db.courses[index], ...req.body };
  writeDB(db);
  addLog("Course Updated", `Updated parameters of course ${db.courses[index].name} (ID: ${id}).`, "Admin User", UserRole.Admin);
  res.json({ success: true, course: db.courses[index] });
});

app.delete("/admin/api/courses/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const course = db.courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  
  db.courses = db.courses.filter(c => c.id !== id);
  writeDB(db);
  addLog("Course Deleted", `Deleted course profile: ${course.name}.`, "Admin User", UserRole.Admin);
  res.json({ success: true });
});

// Batches API
app.get("/admin/api/batches", (req, res) => {
  const db = readDB();
  res.json(db.batches);
});

app.post("/admin/api/batches", (req, res) => {
  const db = readDB();
  const { courseId, name, startDate, endDate, capacity, status } = req.body;
  
  const newBatch: Batch = {
    id: `B-${100 + db.batches.length + 1}`,
    courseId: courseId || "",
    name: name || "New Batch",
    startDate: startDate || "",
    endDate: endDate || "",
    capacity: Number(capacity) || 20,
    status: status || BatchStatus.Upcoming
  };
  
  db.batches.push(newBatch);
  writeDB(db);
  addLog("Batch Created", `Created batch ${newBatch.name} under Course ID: ${courseId}.`, "Admin User", UserRole.Admin);
  res.json({ success: true, batch: newBatch });
});

app.put("/admin/api/batches/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.batches.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "Batch not found" });
  
  db.batches[index] = { ...db.batches[index], ...req.body };
  writeDB(db);
  addLog("Batch Updated", `Modified parameters of batch ${db.batches[index].name}.`, "Admin User", UserRole.Admin);
  res.json({ success: true, batch: db.batches[index] });
});

app.delete("/admin/api/batches/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const batch = db.batches.find(b => b.id === id);
  if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
  
  db.batches = db.batches.filter(b => b.id !== id);
  writeDB(db);
  addLog("Batch Deleted", `Deleted batch ${batch.name}.`, "Admin User", UserRole.Admin);
  res.json({ success: true });
});

// Inquiries API
app.get("/admin/api/inquiries", (req, res) => {
  const db = readDB();
  res.json(db.inquiries);
});

app.post("/admin/api/inquiries", (req, res) => {
  const db = readDB();
  const leadData = req.body;
  
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
    createdAt: new Date().toISOString()
  };
  
  db.inquiries.unshift(newLead);
  writeDB(db);
  addLog("Lead Registered", `Created client inquiry file for ${newLead.name} via ${newLead.source}.`, "Admin User", UserRole.Admin);
  res.json({ success: true, inquiry: newLead });
});

app.put("/admin/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.inquiries.findIndex(q => q.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "Inquiry not found" });
  
  db.inquiries[index] = { ...db.inquiries[index], ...req.body };
  writeDB(db);
  addLog("Lead Updated", `Modified details of lead inquiry: ${db.inquiries[index].name}.`, "Admin User", UserRole.Admin);
  res.json({ success: true, inquiry: db.inquiries[index] });
});

app.delete("/admin/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const lead = db.inquiries.find(q => q.id === id);
  if (!lead) return res.status(404).json({ success: false, message: "Lead file not found" });
  
  db.inquiries = db.inquiries.filter(q => q.id !== id);
  writeDB(db);
  addLog("Lead Purged", `Deleted inquiry profile of ${lead.name}.`, "Admin User", UserRole.Admin);
  res.json({ success: true });
});

// Payments & Receipts API
app.get("/admin/api/payments", (req, res) => {
  const db = readDB();
  res.json(db.payments);
});

app.post("/admin/api/payments", (req, res) => {
  const db = readDB();
  const { studentId, amountPaid, paymentMethod, notes, accountantName } = req.body;
  
  const studentIndex = db.students.findIndex(s => s.id === studentId);
  if (studentIndex === -1) {
    return res.status(404).json({ success: false, message: "Student matching ID not found." });
  }
  
  const student = db.students[studentIndex];
  const paymentAmount = Number(amountPaid);
  
  if (paymentAmount <= 0) {
    return res.status(400).json({ success: false, message: "Payment amount must be greater than zero." });
  }
  
  if (paymentAmount > student.pendingAmount) {
    return res.status(400).json({ success: false, message: `Excess Payment warning! Student only owes ${student.pendingAmount} PKR.` });
  }
  
  const prevBalance = student.pendingAmount;
  const remainingBal = student.pendingAmount - paymentAmount;
  
  // Update student ledger
  student.paidAmount += paymentAmount;
  student.pendingAmount = remainingBal;
  
  // Set next installment date if there's still a pending balance
  if (remainingBal > 0) {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    student.nextInstallmentDate = today.toISOString().split("T")[0];
    student.dueDate = student.nextInstallmentDate;
  } else {
    student.nextInstallmentDate = "";
  }
  
  const course = db.courses.find(c => c.id === student.courseId);
  const batch = db.batches.find(b => b.id === student.batchId);
  const receiptId = `RCP-${10000 + db.payments.length + 1}`;
  
  const newPayment: Payment = {
    id: receiptId,
    studentId: student.id,
    studentName: student.name,
    courseName: course ? course.name : "N/A",
    batchName: batch ? batch.name : "N/A",
    amountPaid: paymentAmount,
    previousBalance: prevBalance,
    remainingBalance: remainingBal,
    paymentMethod: paymentMethod || PaymentMethod.Cash,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentTime: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
    accountantName: accountantName || "Admin User",
    notes: notes || "Installment received"
  };
  
  db.payments.unshift(newPayment);
  writeDB(db);
  
  addLog("Payment Received", `Processed receipt ${receiptId} for student ${student.name}. Collected ${paymentAmount} PKR via ${paymentMethod}.`, accountantName || "Admin User", UserRole.Accountant);
  res.json({ success: true, payment: newPayment, student });
});

// Logs API
app.get("/admin/api/logs", requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.logs);
});

// Settings API
app.get("/admin/api/settings", (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.put("/admin/api/settings", requireAdmin, (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  addLog("Settings Updated", "Updated global parameters of the institute profile and invoice notes.", "Admin User", UserRole.Admin);
  res.json({ success: true, settings: db.settings });
});

// Backups API
app.get("/admin/api/backups", requireAdmin, (req, res) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const backups = files.map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        fileName: file,
        createdAt: stat.birthtime.toISOString().split("T")[0],
        size: `${(stat.size / 1024).toFixed(2)} KB`
      };
    });
    res.json(backups);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to list backups" });
  }
});

app.post("/admin/api/backups", requireAdmin, (req, res) => {
  try {
    const timestamp = Date.now();
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    const db = readDB();
    
    fs.writeFileSync(backupFile, JSON.stringify(db, null, 2), "utf-8");
    addLog("Backup Created", `Created system snapshot archive 'backup-${timestamp}.json'`, "Admin User", UserRole.Admin);
    res.json({ success: true, fileName: `backup-${timestamp}.json` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database backup failed" });
  }
});

app.post("/admin/api/backups/restore", requireAdmin, (req, res) => {
  const { fileName } = req.body;
  if (!fileName) return res.status(400).json({ success: false, message: "File name is required" });
  
  const backupPath = path.join(BACKUP_DIR, fileName);
  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ success: false, message: "Backup file not found" });
  }
  
  try {
    const raw = fs.readFileSync(backupPath, "utf-8");
    const data = JSON.parse(raw);
    writeDB(data);
    addLog("System Restored", `Restored database using state backup: ${fileName}`, "Admin User", UserRole.Admin);
    res.json({ success: true, message: "Database successfully restored." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to parse restore payload" });
  }
});

// Integrate with Vite / Production serving under /admin
const startServer = async () => {
  // HTML document gate: unauthenticated browsers hitting protected /admin pages go to login.
  // Static assets and /admin/api are not redirected here.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (!req.path.startsWith("/admin")) return next();
    if (req.path.startsWith("/admin/api")) return next();
    if (req.path === "/admin/login" || req.path.startsWith("/admin/login/")) return next();
    // Let Vite/static asset requests through (have file extensions or Vite internals)
    if (
      req.path.includes(".") ||
      req.path.startsWith("/admin/@") ||
      req.path.startsWith("/admin/node_modules") ||
      req.path.startsWith("/admin/src")
    ) {
      return next();
    }
    const accept = req.headers.accept || "";
    if (!accept.includes("text/html")) return next();
    if (!getSessionUserId(req.cookies?.[SESSION_COOKIE])) {
      return res.redirect(302, "/admin/login");
    }
    return next();
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      base: "/admin/",
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use("/admin", express.static(distPath, { index: false }));
    app.get(/^\/admin(?:\/.*)?$/, (req, res, next) => {
      if (req.path.startsWith("/admin/api")) return next();
      // Let static middleware handle real files; this is SPA fallback only
      if (req.path.includes(".") && !req.path.endsWith(".html")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Convenience redirect when hitting the admin server root
  app.get("/", (_req, res) => {
    res.redirect("/admin");
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DM Rush Admin running on http://localhost:${PORT}/admin`);
    console.log(`Login: http://localhost:${PORT}/admin/login`);
  });
};

startServer().catch(err => {
  console.error("Failed to boot up DM Rush server", err);
});
