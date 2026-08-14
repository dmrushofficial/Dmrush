"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type StudentRow = { id: string; name: string; email: string };
type Session = {
  id: string;
  date: string;
  label?: string;
  records: Array<{ studentId: string; status: "present" | "absent" | "late" }>;
};

export function TeacherAttendanceClient({
  courses,
}: {
  courses: Array<{ id: string; title: string }>;
}) {
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [marks, setMarks] = useState<Record<string, "present" | "absent" | "late">>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    let alive = true;
    fetch(`/api/attendance?courseId=${encodeURIComponent(courseId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (!d.success) {
          setError(d.message || "Failed");
          setLoading(false);
          return;
        }
        setError("");
        setStudents(d.students || []);
        setSessions(d.sessions || []);
        const next: Record<string, "present" | "absent" | "late"> = {};
        for (const s of d.students || []) next[s.id] = "present";
        const existing = (d.sessions || []).find((s: Session) => s.date === date);
        if (existing) {
          for (const r of existing.records) next[r.studentId] = r.status;
          setLabel(existing.label || "");
        }
        setMarks(next);
        setLoading(false);
      })
      .catch(() => {
        if (alive) {
          setError("Failed to load");
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const reload = () => {
    fetch(`/api/attendance?courseId=${encodeURIComponent(courseId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) {
          setError(d.message || "Failed");
          return;
        }
        setStudents(d.students || []);
        setSessions(d.sessions || []);
      });
  };

  const courseTitle = useMemo(
    () => courses.find((c) => c.id === courseId)?.title || "",
    [courses, courseId],
  );

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const records = Object.entries(marks).map(([studentId, status]) => ({ studentId, status }));
    const res = await fetch("/api/attendance", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, date, label, records }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Save failed");
      return;
    }
    setMessage("Attendance saved.");
    reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Attendance</h1>
        <p className="mt-2 text-sm text-muted">
          Mark Present / Absent / Late for enrolled students in your assigned courses.
        </p>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm font-semibold">Course</label>
            <select
              className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Class date</label>
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Label (optional)</label>
            <input
              className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Week 3 class"
            />
          </div>
        </div>

        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.08em] text-muted">
                <th className="py-2 pr-4">Student</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-line/70">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-ink">{s.name}</p>
                    <p className="text-xs text-muted break-all">{s.email}</p>
                  </td>
                  <td className="py-3">
                    <select
                      className="rounded-lg border border-line bg-cream px-2 py-1.5"
                      value={marks[s.id] || "present"}
                      onChange={(e) =>
                        setMarks((prev) => ({
                          ...prev,
                          [s.id]: e.target.value as "present" | "absent" | "late",
                        }))
                      }
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 ? (
            <p className="py-4 text-sm text-muted">No enrolled students for {courseTitle}.</p>
          ) : null}
        </div>

        <Button type="submit" disabled={!students.length}>
          Save attendance
        </Button>
      </form>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold text-ink">Recent sessions</h2>
        <ul className="mt-3 space-y-2">
          {sessions.slice(0, 8).map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2 text-sm">
              <Badge>{s.date}</Badge>
              <span className="text-muted">{s.label || "Class"}</span>
              <span className="text-xs text-muted">{s.records.length} marked</span>
            </li>
          ))}
          {sessions.length === 0 ? <p className="text-sm text-muted">No sessions yet.</p> : null}
        </ul>
      </div>
    </div>
  );
}
