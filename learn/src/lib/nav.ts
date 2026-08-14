export const studentNav = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "My Courses", href: "/student/courses" },
  { label: "Assignments", href: "/student/assignments" },
  { label: "Grades", href: "/student/grades" },
  { label: "Attendance", href: "/student/attendance" },
  { label: "Certificates", href: "/student/certificates" },
  { label: "Announcements", href: "/student/announcements" },
  { label: "Profile", href: "/student/profile" },
] as const;

export const teacherNav = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "My Courses", href: "/teacher/courses" },
  { label: "Students", href: "/teacher/students" },
  { label: "Assignments", href: "/teacher/assignments" },
  { label: "Attendance", href: "/teacher/attendance" },
  { label: "Announcements", href: "/teacher/announcements" },
  { label: "Profile", href: "/teacher/profile" },
] as const;
