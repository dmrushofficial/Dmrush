"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Submission = {
  id: string;
  studentName: string;
  studentEmail: string;
  writtenText?: string;
  url?: string;
  fileId?: string;
  status: string;
  obtainedMarks?: number;
  feedback?: string;
  submittedAt: string;
  attempts?: Array<{
    id: string;
    attemptNumber: number;
    writtenText?: string;
    url?: string;
    fileId?: string;
    submittedAt: string;
    status: string;
    obtainedMarks?: number;
    feedback?: string;
  }>;
};

export function TeacherAssignmentReviewClient({ id }: { id: string }) {
  const [title, setTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`/api/assignments/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (!d.success) {
          setError(d.message || "Failed");
          return;
        }
        setTitle(d.assignment.title);
        setTotalMarks(d.assignment.totalMarks);
        setSubmissions(d.submissions);
        const m: Record<string, string> = {};
        const f: Record<string, string> = {};
        for (const s of d.submissions as Submission[]) {
          m[s.id] = s.obtainedMarks != null ? String(s.obtainedMarks) : "";
          f[s.id] = s.feedback || "";
        }
        setMarks(m);
        setFeedback(f);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const reload = () => {
    setLoading(true);
    fetch(`/api/assignments/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) {
          setError(d.message || "Failed");
          return;
        }
        setSubmissions(d.submissions);
      })
      .finally(() => setLoading(false));
  };

  const grade = async (
    submissionId: string,
    action: "review" | "resubmission_required",
  ) => {
    setError("");
    const res = await fetch(`/api/assignments/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId,
        action,
        obtainedMarks: action === "review" ? Number(marks[submissionId]) : undefined,
        feedback: feedback[submissionId] || "",
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Update failed");
      return;
    }
    reload();
  };

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink break-words">{title}</h1>
        <p className="mt-2 text-sm text-muted">Review submissions, grade, or request resubmission.</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {submissions.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No submissions yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <li key={s.id} className="rounded-2xl border border-line bg-surface p-5 overflow-x-auto">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{s.studentName}</p>
                  <p className="text-xs text-muted break-all">{s.studentEmail}</p>
                  <p className="mt-1 text-xs text-muted">
                    Latest {new Date(s.submittedAt).toLocaleString()}
                  </p>
                </div>
                <Badge tone={s.status === "reviewed" ? "success" : "warning"}>
                  {s.status.replaceAll("_", " ")}
                </Badge>
              </div>

              {(s.attempts || []).length > 0 ? (
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                    Submission history
                  </p>
                  {[...(s.attempts || [])].reverse().map((a) => (
                    <div key={a.id} className="rounded-xl border border-line bg-cream p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">Attempt {a.attemptNumber}</span>
                        <Badge>{a.status.replaceAll("_", " ")}</Badge>
                      </div>
                      {a.writtenText ? (
                        <p className="mt-2 whitespace-pre-wrap text-ink/90">{a.writtenText}</p>
                      ) : null}
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block font-semibold text-accent"
                        >
                          Open link →
                        </a>
                      ) : null}
                      {a.fileId ? (
                        <a
                          href={`/api/files/${a.fileId}`}
                          className="mt-2 ml-3 inline-block font-semibold text-accent"
                        >
                          Download file ↓
                        </a>
                      ) : null}
                      {a.feedback ? (
                        <p className="mt-2 text-muted">Feedback: {a.feedback}</p>
                      ) : null}
                      {a.obtainedMarks != null ? (
                        <p className="mt-1 font-semibold">
                          Marks: {a.obtainedMarks}/{totalMarks}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {s.writtenText ? (
                    <p className="mt-4 whitespace-pre-wrap rounded-xl bg-cream p-4 text-sm text-ink/90">
                      {s.writtenText}
                    </p>
                  ) : null}
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-accent"
                    >
                      Open link →
                    </a>
                  ) : null}
                  {s.fileId ? (
                    <a
                      href={`/api/files/${s.fileId}`}
                      className="mt-3 ml-3 inline-block text-sm font-semibold text-accent"
                    >
                      Download file ↓
                    </a>
                  ) : null}
                </>
              )}

              <form className="mt-4 grid gap-3 md:grid-cols-[8rem_1fr_auto_auto]">
                <div>
                  <label className="text-xs font-semibold text-muted">Marks</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm"
                    value={marks[s.id] || ""}
                    onChange={(e) => setMarks((prev) => ({ ...prev, [s.id]: e.target.value }))}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted">Feedback</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm"
                    value={feedback[s.id] || ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({ ...prev, [s.id]: e.target.value }))
                    }
                  />
                </div>
                <Button type="button" onClick={() => void grade(s.id, "review")}>
                  Mark reviewed
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void grade(s.id, "resubmission_required")}
                >
                  Resubmission required
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
