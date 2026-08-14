"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";

type Row = {
  id: string;
  title: string;
  courseTitle: string;
  totalMarks: number;
  submission: null | { status: string; obtainedMarks?: number; feedback?: string };
};

export function StudentGradesClient() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/assignments", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.success) setItems(data.assignments);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading grades…</p>;

  const graded = items.filter((i) => i.submission?.status === "reviewed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Grades</h1>
        <p className="mt-2 text-sm text-muted">Marks from graded assignments.</p>
      </div>
      {graded.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No graded work yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Assignment</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {graded.map((row) => (
                <tr key={row.id} className="border-b border-line/70">
                  <td className="px-4 py-3 font-semibold text-ink">{row.title}</td>
                  <td className="px-4 py-3 text-muted">{row.courseTitle}</td>
                  <td className="px-4 py-3 font-mono">
                    {row.submission?.obtainedMarks}/{row.totalMarks}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="success">graded</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
