import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { studentNav } from "@/lib/nav";
import { getPortalStudentSession } from "@/lib/portal/session-server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const student = await getPortalStudentSession();
  if (!student) {
    redirect("/login");
  }

  return (
    <DashboardShell
      brand="Student"
      nav={[...studentNav]}
      userName={student.name}
      userRole={student.cohort}
    >
      {children}
    </DashboardShell>
  );
}
