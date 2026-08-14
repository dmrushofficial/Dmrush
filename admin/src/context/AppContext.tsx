import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";
import { 
  Student, Course, Batch, Inquiry, Payment, ActivityLog, Settings, 
  User, UserRole, StudentStatus, LeadStatus, PaymentMethod, Teacher 
} from "../types.js";

interface AppContextType {
  currentUser: User | null;
  switchUserRole: (role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  users: User[];
  updateUserCredentials: (id: string, email: string, password?: string, name?: string) => Promise<boolean>;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  batches: Batch[];
  inquiries: Inquiry[];
  payments: Payment[];
  logs: ActivityLog[];
  settings: Settings | null;
  backups: { fileName: string; createdAt: string; size: string }[];
  isLoading: boolean;
  
  // Refresh functions
  refreshAll: () => Promise<void>;
  
  // Students
  addStudent: (studentData: Partial<Student>) => Promise<{
    student: Student;
    portalAccount?: {
      provisioned: boolean;
      created?: boolean;
      email?: string;
      initialPassword?: string;
      loginUrl?: string;
      courseName?: string;
      reason?: string;
    };
  } | null>;
  updateStudent: (id: string, studentData: Partial<Student>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;

  // Teachers (Learn portal)
  addTeacher: (data: Partial<Teacher> & { password?: string }) => Promise<{
    teacher: Teacher;
    portalAccount?: {
      provisioned: boolean;
      created?: boolean;
      email?: string;
      initialPassword?: string;
      loginUrl?: string;
      reason?: string;
    };
  } | null>;
  updateTeacher: (id: string, data: Partial<Teacher> & { password?: string }) => Promise<boolean>;
  deleteTeacher: (id: string) => Promise<boolean>;
  resetTeacherPortalPassword: (id: string) => Promise<{
    email: string;
    initialPassword: string;
    loginUrl: string;
  } | null>;
  
  // Courses
  addCourse: (courseData: Partial<Course>) => Promise<boolean>;
  updateCourse: (id: string, courseData: Partial<Course>) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<boolean>;
  
  // Batches
  addBatch: (batchData: Partial<Batch>) => Promise<boolean>;
  updateBatch: (id: string, batchData: Partial<Batch>) => Promise<boolean>;
  deleteBatch: (id: string) => Promise<boolean>;
  
  // Inquiries
  addInquiry: (inquiryData: Partial<Inquiry>) => Promise<boolean>;
  updateInquiry: (id: string, inquiryData: Partial<Inquiry>) => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;
  convertInquiryToStudent: (inquiryId: string, courseId: string, shift: any, notes: string) => Promise<boolean>;
  
  // Payments
  submitPayment: (paymentData: { studentId: string; amountPaid: number; paymentMethod: PaymentMethod; notes: string }) => Promise<Payment | null>;
  
  // Settings
  updateSettings: (settingsData: Partial<Settings>) => Promise<boolean>;
  
  // Backup & Restore
  triggerBackup: () => Promise<boolean>;
  triggerRestore: (fileName: string) => Promise<boolean>;
  resetDatabase: () => Promise<boolean>;
  
  // Printing slip overlay
  activePrintStudent: Student | null;
  setActivePrintStudent: (student: Student | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePrintStudent, setActivePrintStudent] = useState<Student | null>(null);

  const clearClientAuthArtifacts = () => {
    localStorage.removeItem("dmrush_current_user");
    localStorage.removeItem("betech_current_user");
  };

  const handleUnauthorized = () => {
    setCurrentUser(null);
    clearClientAuthArtifacts();
  };

  // Switch role helper (Admin-only server session swap)
  const switchUserRole = async (role: UserRole) => {
    try {
      const res = await apiFetch("/auth/switch-role", {
        method: "POST",
        body: JSON.stringify({ role }),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        clearClientAuthArtifacts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        clearClientAuthArtifacts();
        setCurrentUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Invalid credentials." };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server connection failed." };
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentUser(null);
      clearClientAuthArtifacts();
    }
  };

  const updateUserCredentials = async (id: string, email: string, password?: string, name?: string) => {
    try {
      const payload: { email: string; name?: string; password?: string } = { email, name };
      if (password && password.length > 0) {
        payload.password = password;
      }
      const res = await apiFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return false;
      }
      if (res.ok) {
        await refreshAll();
        if (currentUser && currentUser.id === id) {
          const updatedUser = { ...currentUser, email, name: name || currentUser.name };
          setCurrentUser(updatedUser);
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const refreshAll = async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const isAdmin = currentUser.role === UserRole.Admin;
      const corePaths = [
        "/students",
        "/teachers",
        "/courses",
        "/batches",
        "/inquiries",
        "/payments",
        "/settings",
      ] as const;
      const adminPaths = isAdmin
        ? (["/logs", "/backups", "/users"] as const)
        : [];

      const responses = await Promise.all(
        [...corePaths, ...adminPaths].map((p) => apiFetch(p)),
      );

      if (responses.some((r) => r.status === 401)) {
        handleUnauthorized();
        return;
      }

      const jsonFor = async <T,>(res: Response, fallback: T): Promise<T> =>
        res.ok ? ((await res.json()) as T) : fallback;

      const [std, tch, crs, bat, inq, pay, settingsData, ...adminData] = await Promise.all([
        jsonFor<Student[]>(responses[0], []),
        jsonFor<Teacher[]>(responses[1], []),
        jsonFor<Course[]>(responses[2], []),
        jsonFor<Batch[]>(responses[3], []),
        jsonFor<Inquiry[]>(responses[4], []),
        jsonFor<Payment[]>(responses[5], []),
        jsonFor<Settings | null>(responses[6], null),
        ...adminPaths.map((_, i) => jsonFor(responses[7 + i], [] as any[])),
      ]);

      setStudents(std);
      setTeachers(tch);
      setCourses(crs);
      setBatches(bat);
      setInquiries(inq);
      setPayments(pay);
      setSettings(settingsData);
      if (isAdmin) {
        setLogs(adminData[0] || []);
        setBackups(adminData[1] || []);
        setUsers(adminData[2] || []);
      } else {
        setLogs([]);
        setBackups([]);
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to sync backend data states:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Bootstrap session from HTTP-only cookie (never trust localStorage for auth)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      clearClientAuthArtifacts();
      try {
        const res = await apiFetch("/auth/me");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.user) setCurrentUser(data.user);
          else setCurrentUser(null);
        } else {
          setCurrentUser(null);
        }
      } catch {
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (currentUser) {
      refreshAll();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, currentUser?.id, currentUser?.role]);

  // Add Student
  const addStudent = async (studentData: Partial<Student>) => {
    try {
      const res = await apiFetch("/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        const data = await res.json();
        await refreshAll();
        if (data.student) {
          return { student: data.student, portalAccount: data.portalAccount };
        }
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Update Student
  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      const res = await apiFetch(`/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete Student
  const deleteStudent = async (id: string) => {
    try {
      const res = await apiFetch(`/students/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const addTeacher = async (data: Partial<Teacher> & { password?: string }) => {
    try {
      const res = await apiFetch("/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const payload = await res.json();
        await refreshAll();
        if (payload.teacher) {
          return { teacher: payload.teacher as Teacher, portalAccount: payload.portalAccount };
        }
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const updateTeacher = async (id: string, data: Partial<Teacher> & { password?: string }) => {
    try {
      const res = await apiFetch(`/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteTeacher = async (id: string) => {
    try {
      const res = await apiFetch(`/teachers/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const resetTeacherPortalPassword = async (id: string) => {
    try {
      const res = await apiFetch(`/teachers/${id}/portal-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        await refreshAll();
        if (data.portalAccount?.email && data.portalAccount?.initialPassword) {
          return {
            email: data.portalAccount.email as string,
            initialPassword: data.portalAccount.initialPassword as string,
            loginUrl: (data.portalAccount.loginUrl as string) || "http://localhost:3001/login",
          };
        }
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Courses CRUD
  const addCourse = async (courseData: Partial<Course>) => {
    try {
      const res = await apiFetch("/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const res = await apiFetch(`/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteCourse = async (id: string) => {
    try {
      const res = await apiFetch(`/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Batches CRUD
  const addBatch = async (batchData: Partial<Batch>) => {
    try {
      const res = await apiFetch("/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateBatch = async (id: string, batchData: Partial<Batch>) => {
    try {
      const res = await apiFetch(`/batches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteBatch = async (id: string) => {
    try {
      const res = await apiFetch(`/batches/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Inquiries CRUD
  const addInquiry = async (inquiryData: Partial<Inquiry>) => {
    try {
      const res = await apiFetch("/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateInquiry = async (id: string, inquiryData: Partial<Inquiry>) => {
    try {
      const res = await apiFetch(`/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteInquiry = async (id: string) => {
    try {
      const res = await apiFetch(`/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Convert Inquiry to Student
  const convertInquiryToStudent = async (inquiryId: string, courseId: string, shift: any, notes: string) => {
    try {
      // Find inquiry
      const inquiry = inquiries.find(q => q.id === inquiryId);
      const course = courses.find(c => c.id === courseId);
      if (!inquiry || !course) return false;
      
      // Calculate start and end dates
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 4); // default 4 months
      
      // Auto assign a batch under this course
      const courseBatch = batches.find(b => b.courseId === courseId && b.status === "Active") || batches[0];

      // Step 1: Add Student
      const result = await addStudent({
        name: inquiry.name,
        fatherName: "",
        cnic: "",
        phone: inquiry.phone,
        email: inquiry.email,
        admissionDate: startDate,
        courseId: courseId,
        batchId: courseBatch ? courseBatch.id : "",
        shift: shift,
        startDate: startDate,
        endDate: endDate.toISOString().split("T")[0],
        duration: course.duration,
        status: StudentStatus.Active,
        notes: `Converted from Inquiry CRM record. ${notes}\nOriginal notes: ${inquiry.notes}`,
        totalFee: course.totalFee,
        discount: 0,
        paidAmount: 0,
        pendingAmount: course.totalFee,
        dueDate: startDate
      });

      if (result?.student) {
        // Step 2: Mark Lead as Converted
        await updateInquiry(inquiryId, { status: LeadStatus.Converted });
        return true;
      }
    } catch (err) {
      console.error("Error in lead conversion process:", err);
    }
    return false;
  };

  // Payments
  const submitPayment = async (paymentData: { studentId: string; amountPaid: number; paymentMethod: PaymentMethod; notes: string }) => {
    try {
      const res = await apiFetch("/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentData,
          accountantName: currentUser?.name || "Accountant User"
        })
      });
      if (res.ok) {
        const body = await res.json();
        await refreshAll();
        return body.payment;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Settings
  const updateSettings = async (settingsData: Partial<Settings>) => {
    try {
      const res = await apiFetch("/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData)
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Backup & Restore
  const triggerBackup = async () => {
    try {
      const res = await apiFetch("/backups", { method: "POST" });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const triggerRestore = async (fileName: string) => {
    try {
      const res = await apiFetch("/backups/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName })
      });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const resetDatabase = async () => {
    try {
      const res = await apiFetch("/db/reset", { method: "POST" });
      if (res.ok) {
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchUserRole,
      login,
      logout,
      users,
      updateUserCredentials,
      students,
      teachers,
      courses,
      batches,
      inquiries,
      payments,
      logs,
      settings,
      backups,
      isLoading,
      refreshAll,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      resetTeacherPortalPassword,
      addCourse,
      updateCourse,
      deleteCourse,
      addBatch,
      updateBatch,
      deleteBatch,
      addInquiry,
      updateInquiry,
      deleteInquiry,
      convertInquiryToStudent,
      submitPayment,
      updateSettings,
      triggerBackup,
      triggerRestore,
      resetDatabase,
      activePrintStudent,
      setActivePrintStudent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
