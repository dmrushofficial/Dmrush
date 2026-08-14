import { redirect } from "next/navigation";
import { ProfilePasswordForm } from "@/components/student/ProfilePasswordForm";
import { getPortalStudentSession } from "@/lib/portal/session-server";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Profile",
  description: "Student profile",
  path: "/student/profile",
  noIndex: true,
});

export default async function StudentProfilePage() {
  const student = await getPortalStudentSession();
  if (!student) redirect("/login");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Profile</h1>
        <p className="mt-2 text-sm text-muted">Your admission details and portal login settings.</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold">Name</label>
          <input
            className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm bg-cream"
            defaultValue={student.name}
            readOnly
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm bg-cream"
            defaultValue={student.email}
            readOnly
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Phone</label>
          <input
            className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm bg-cream"
            defaultValue={student.phone || "—"}
            readOnly
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Cohort / Course</label>
          <input
            className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm bg-cream"
            defaultValue={student.cohort}
            readOnly
          />
        </div>
        <ProfilePasswordForm student={student} />
      </div>
    </div>
  );
}
