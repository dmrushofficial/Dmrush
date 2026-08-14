"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Item = {
  courseId: string;
  courseTitle: string;
  state: "locked" | "eligible" | "issued";
  eligibility: {
    progressPercent: number;
    lessonsCompleted: number;
    lessonsTotal: number;
    assignmentsPassed: number;
    assignmentsRequired: number;
    missingAssignmentTitles: string[];
  };
  certificate: null | {
    id: string;
    certificateCode: string;
    title: string;
    issuedAt: string;
  };
};

export function StudentCertificatesClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/certificates", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.success) setItems(d.items || []);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Certificates</h1>
        <p className="mt-2 text-sm text-muted">
          Eligible when all lessons are complete and all course assignments are reviewed at a
          passing mark. DMRUSH course completion certificates — not external accreditation.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No enrolled courses yet.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.courseId} className="rounded-2xl border border-line bg-surface p-5">
              <Badge
                tone={
                  item.state === "issued"
                    ? "success"
                    : item.state === "eligible"
                      ? "signal"
                      : "warning"
                }
              >
                {item.state}
              </Badge>
              <h2 className="mt-3 text-lg font-bold text-ink break-words">{item.courseTitle}</h2>
              <p className="mt-2 text-sm text-muted">
                Lessons {item.eligibility.lessonsCompleted}/{item.eligibility.lessonsTotal} ·
                Assignments {item.eligibility.assignmentsPassed}/
                {item.eligibility.assignmentsRequired}
              </p>
              <ProgressBar value={item.eligibility.progressPercent} className="mt-3" />
              {item.state === "issued" && item.certificate ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted">ID: {item.certificate.certificateCode}</p>
                  <Button href={`/student/certificates/${item.certificate.id}`} size="sm">
                    View / print certificate
                  </Button>
                </div>
              ) : item.state === "eligible" ? (
                <p className="mt-4 text-sm text-muted">
                  You are eligible. Ask your teacher to issue the certificate.
                </p>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  Complete remaining lessons
                  {item.eligibility.missingAssignmentTitles.length
                    ? ` and pass: ${item.eligibility.missingAssignmentTitles.join(", ")}`
                    : ""}
                  .
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
