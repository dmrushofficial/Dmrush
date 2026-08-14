"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

type CourseAtt = {
  courseId: string;
  courseTitle: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percent: number;
  history: Array<{
    date: string;
    label?: string;
    status: string;
    courseTitle: string;
  }>;
};

export function StudentAttendanceClient() {
  const [byCourse, setByCourse] = useState<CourseAtt[]>([]);
  const [overallPercent, setOverallPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/attendance", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (!d.success) {
          setError(d.message || "Failed");
          return;
        }
        setByCourse(d.byCourse || []);
        setOverallPercent(d.overall?.percent || 0);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Attendance</h1>
        <p className="mt-2 text-sm text-muted">
          Course-wise attendance from classes marked by your teachers.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-5">
        <p className="text-sm font-semibold text-ink">Overall attendance</p>
        <p className="mt-1 text-2xl font-bold text-ink">{overallPercent}%</p>
        <ProgressBar value={overallPercent} className="mt-3" />
      </div>

      {byCourse.map((c) => (
        <section key={c.courseId} className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink break-words">{c.courseTitle}</h2>
              <p className="mt-1 text-sm text-muted">
                Present {c.present} · Late {c.late} · Absent {c.absent}
              </p>
            </div>
            <Badge tone="signal">{c.percent}%</Badge>
          </div>
          <ProgressBar value={c.percent} className="mt-3" />
          <ul className="mt-4 space-y-2">
            {c.history.map((h, idx) => (
              <li
                key={`${h.date}-${idx}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-cream px-3 py-2 text-sm"
              >
                <span>
                  {h.date}
                  {h.label ? ` · ${h.label}` : ""}
                </span>
                <Badge
                  tone={
                    h.status === "present" ? "success" : h.status === "late" ? "warning" : "danger"
                  }
                >
                  {h.status}
                </Badge>
              </li>
            ))}
            {c.history.length === 0 ? (
              <p className="text-sm text-muted">No attendance records yet.</p>
            ) : null}
          </ul>
        </section>
      ))}

      {byCourse.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No enrolled courses yet.
        </p>
      ) : null}
    </div>
  );
}
