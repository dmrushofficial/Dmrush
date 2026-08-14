"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type AssignmentRow = {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  totalMarks: number;
  submission: null | { status: string; obtainedMarks?: number };
};

export function StudentAssignmentsClient() {
  const [items, setItems] = useState<AssignmentRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/assignments", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.success) setItems(data.assignments);
        else setError(data.message || "Failed to load");
      })
      .catch(() => {
        if (alive) setError("Failed to load assignments");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading assignments…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Assignments</h1>
        <p className="mt-2 text-sm text-muted">Work assigned to your enrolled courses.</p>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No assignments yet. Your teacher will post work for your courses here.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const status = item.submission?.status || "not_submitted";
            return (
              <li key={item.id}>
                <Link
                  href={`/student/assignments/${item.id}`}
                  className="block rounded-2xl border border-line bg-surface p-5 hover:border-accent/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-ink">{item.title}</h2>
                      <p className="mt-1 text-sm text-muted">
                        {item.courseTitle} · Due {item.dueDate} · {item.totalMarks} marks
                      </p>
                    </div>
                    <Badge
                      tone={
                        status === "reviewed"
                          ? "success"
                          : status === "submitted"
                            ? "signal"
                            : "neutral"
                      }
                    >
                      {status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Button href="/student/dashboard" variant="secondary" size="sm">
        ← Dashboard
      </Button>
    </div>
  );
}
