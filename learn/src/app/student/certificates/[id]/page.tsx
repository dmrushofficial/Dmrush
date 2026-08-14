import { notFound, redirect } from "next/navigation";
import { getCourseById } from "@/content/courses";
import { findPortalStudentById } from "@/lib/portal/db";
import { listCertificates } from "@/lib/portal/lms-db";
import { getPortalStudentSession } from "@/lib/portal/session-server";
import { PrintCertificateActions } from "@/components/student/PrintCertificateActions";

type Props = { params: Promise<{ id: string }> };

export default async function CertificatePrintPage({ params }: Props) {
  const student = await getPortalStudentSession();
  if (!student) redirect("/login");
  const { id } = await params;
  const cert = listCertificates().find((c) => c.id === id && c.studentId === student.id);
  if (!cert) notFound();
  const course = getCourseById(cert.courseId);
  const holder = findPortalStudentById(student.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 print:max-w-none">
      <PrintCertificateActions />

      <article className="rounded-2xl border-2 border-ink bg-surface px-8 py-12 text-center print:border print:px-12 print:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">DMRUSH Learn</p>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-ink md:text-4xl">
          Certificate of Completion
        </h1>
        <p className="mt-6 text-sm text-muted">This certifies that</p>
        <p className="mt-2 text-2xl font-bold text-ink">{holder?.name || student.name}</p>
        <p className="mt-6 text-sm text-muted">has successfully completed</p>
        <p className="mt-2 text-xl font-semibold text-ink">{course?.title || cert.title}</p>
        <p className="mx-auto mt-8 max-w-md text-sm leading-6 text-muted">
          Issued by DMRUSH Institute (Pattoki). This is an institute course completion certificate
          and does not claim external accreditation.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-left text-xs text-muted">
          <div>
            <p>Certificate ID</p>
            <p className="mt-1 font-semibold text-ink">{cert.certificateCode}</p>
          </div>
          <div>
            <p>Issued</p>
            <p className="mt-1 font-semibold text-ink">
              {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
