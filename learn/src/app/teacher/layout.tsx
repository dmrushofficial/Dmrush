import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { teacherNav } from "@/lib/nav";
import { getPortalTeacherSession } from "@/lib/portal/session-server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const teacher = await getPortalTeacherSession();
  if (!teacher) {
    redirect("/login?next=/teacher/dashboard");
  }

  return (
    <DashboardShell
      brand="Teacher"
      nav={[...teacherNav]}
      userName={teacher.name}
      userRole={teacher.roleTitle}
    >
      {children}
    </DashboardShell>
  );
}
