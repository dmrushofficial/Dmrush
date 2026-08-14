"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type CourseOpt = { id: string; title: string };
type AssignmentRow = {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  totalMarks: number;
  submissionCount: number;
  pendingCount: number;
  status: string;
};

export function TeacherAssignmentsClient() {
  const [items, setItems] = useState<AssignmentRow[]>([]);
  const [courses, setCourses] = useState<CourseOpt[]>([]);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/assignments", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.success) {
          setItems(d.assignments);
          setCourses(d.courses || []);
          setCourseId((prev) => prev || d.courses?.[0]?.id || "");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const reload = () => {
    fetch("/api/assignments", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setItems(d.assignments);
          setCourses(d.courses || []);
        }
      });
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, instructions, dueDate, courseId, totalMarks }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to create");
        return;
      }
      setTitle("");
      setInstructions("");
      setDueDate("");
      reload();
    } catch {
      setError("Could not create assignment");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this assignment and its submissions?")) return;
    await fetch(`/api/assignments?id=${id}`, { method: "DELETE", credentials: "include" });
    reload();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Assignments</h1>
        <p className="mt-2 text-sm text-muted">Create work for students and review submissions.</p>
      </div>

      <form onSubmit={create} className="space-y-3 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold text-ink">Create assignment</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Course</label>
            <select
              className="mt-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Due date</label>
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Title</label>
          <input
            className="mt-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Instructions</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm"
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>
        <div className="max-w-xs">
          <label className="text-sm font-semibold">Total marks</label>
          <input
            type="number"
            min={1}
            className="mt-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm"
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" variant="signal" disabled={saving || courses.length === 0}>
          {saving ? "Creating…" : "Create assignment"}
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-ink">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {item.courseTitle} · Due {item.dueDate} · {item.totalMarks} marks
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {item.submissionCount} submissions · {item.pendingCount} pending review
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={item.pendingCount ? "warning" : "success"}>{item.status}</Badge>
                  <Link
                    href={`/teacher/assignments/${item.id}`}
                    className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-on-accent"
                  >
                    Review
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-lg border border-line px-3 py-2 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {items.length === 0 ? (
            <p className="text-sm text-muted">No assignments yet — create one above.</p>
          ) : null}
        </ul>
      )}
    </div>
  );
}
