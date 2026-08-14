import { redirect } from "next/navigation";
import { getPortalTeacherSession } from "@/lib/portal/session-server";

export default async function TeacherProfilePage() {
  const teacher = await getPortalTeacherSession();
  if (!teacher) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Profile</h1>
        <p className="mt-2 text-sm text-muted">Your instructor account details.</p>
      </div>
      <dl className="space-y-4 rounded-2xl border border-line bg-surface p-6 text-sm">
        <div>
          <dt className="text-muted">Name</dt>
          <dd className="mt-1 font-semibold text-ink">{teacher.name}</dd>
        </div>
        <div>
          <dt className="text-muted">Email</dt>
          <dd className="mt-1 font-semibold text-ink">{teacher.email}</dd>
        </div>
        <div>
          <dt className="text-muted">Role</dt>
          <dd className="mt-1 font-semibold text-ink">{teacher.roleTitle}</dd>
        </div>
        <div>
          <dt className="text-muted">Assigned courses</dt>
          <dd className="mt-1 font-semibold text-ink">{teacher.assignedCourseIds.length}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted">
        Default demo login: teacher@dmrush.com / teacher. Change via data/portal-teachers.json or
        ask admin to provision instructors.
      </p>
    </div>
  );
}
