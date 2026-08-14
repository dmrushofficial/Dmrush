import { TeacherAttendanceClient } from "@/components/teacher/TeacherAttendanceClient";
import { courses } from "@/content/courses";
import { getPortalTeacherSession } from "@/lib/portal/session-server";
import { redirect } from "next/navigation";

export default async function TeacherAttendancePage() {
  const teacher = await getPortalTeacherSession();
  if (!teacher) redirect("/login");
  const assigned = courses
    .filter((c) => teacher.assignedCourseIds.includes(c.id))
    .map((c) => ({ id: c.id, title: c.title }));

  return <TeacherAttendanceClient courses={assigned} />;
}
