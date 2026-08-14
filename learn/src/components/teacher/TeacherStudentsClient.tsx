"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  enrolledCourseIds: string[];
};

type CourseOpt = { id: string; title: string };

export function TeacherStudentsClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<CourseOpt[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/teacher/students", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/assignments", { credentials: "include" }).then((r) => r.json()),
    ]).then(([st, asg]) => {
      if (!alive) return;
      if (st.success) setStudents(st.students);
      if (asg.success) setCourses(asg.courses || []);
    });
    return () => {
      alive = false;
    };
  }, []);

  const issueCert = async (studentId: string, courseId: string, e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch("/api/certificates", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, courseId }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Failed to issue certificate");
      return;
    }
    setMessage(`Certificate issued for ${json.certificate.studentName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Students</h1>
        <p className="mt-2 text-sm text-muted">
          Students enrolled in your assigned courses. Certificates require 100% lessons complete
          and all course assignments reviewed at a passing mark (default 50%).
        </p>
      </div>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {students.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No students enrolled in your courses yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-line/70 align-top">
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3 text-muted">{s.email}</td>
                  <td className="px-4 py-3 text-muted">{s.enrolledCourses.join(", ")}</td>
                  <td className="px-4 py-3">
                    <form
                      onSubmit={(e) => {
                        const select = (e.currentTarget.elements.namedItem("courseId") as HTMLSelectElement)
                          .value;
                        issueCert(s.id, select, e);
                      }}
                      className="flex flex-wrap gap-2"
                    >
                      <select
                        name="courseId"
                        className="rounded-lg border border-line px-2 py-1.5 text-xs"
                        defaultValue={s.enrolledCourseIds[0]}
                      >
                        {s.enrolledCourseIds.map((id) => {
                          const course = courses.find((c) => c.id === id);
                          return (
                            <option key={id} value={id}>
                              {course?.title ?? id}
                            </option>
                          );
                        })}
                      </select>
                      <Button type="submit" variant="secondary" size="sm">
                        Issue cert
                      </Button>
                    </form>
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
