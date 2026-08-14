"use client";

import { FormEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Attempt = {
  id: string;
  attemptNumber: number;
  writtenText?: string;
  url?: string;
  fileId?: string;
  submittedAt: string;
  status: string;
  obtainedMarks?: number;
  feedback?: string;
};

type Payload = {
  assignment: {
    id: string;
    title: string;
    instructions: string;
    dueDate: string;
    totalMarks: number;
    courseTitle: string;
    submissionTypes: string[];
  };
  submission: null | {
    status: string;
    writtenText?: string;
    url?: string;
    fileId?: string;
    obtainedMarks?: number;
    feedback?: string;
    attempts?: Attempt[];
  };
};

export function StudentAssignmentDetailClient({ id }: { id: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [writtenText, setWrittenText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/assignments/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (!alive) return;
        if (!res.success) {
          setError(res.message || "Not found");
          return;
        }
        setData(res);
        setWrittenText(res.submission?.writtenText || "");
        setUrl(res.submission?.url || "");
      })
      .catch(() => {
        if (alive) setError("Failed to load");
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
      .then((res) => {
        if (!res.success) {
          setError(res.message || "Not found");
          return;
        }
        setData(res);
        setWrittenText("");
        setUrl("");
        setFile(null);
      })
      .finally(() => setLoading(false));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      let res: Response;
      if (file) {
        const form = new FormData();
        form.set("writtenText", writtenText);
        form.set("url", url);
        form.set("file", file);
        res = await fetch(`/api/assignments/${id}`, {
          method: "POST",
          credentials: "include",
          body: form,
        });
      } else {
        res = await fetch(`/api/assignments/${id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ writtenText, url }),
        });
      }
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Submit failed");
        return;
      }
      setMessage("Submitted successfully.");
      reload();
    } catch {
      setError("Could not submit.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading…</p>;
  if (error && !data) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const { assignment, submission } = data;
  const locked = submission?.status === "reviewed";
  const canSubmit = !submission || submission.status === "resubmission_required";

  const types = assignment.submissionTypes?.length
    ? assignment.submissionTypes
    : ["written", "url", "file"];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Badge>{(submission?.status || "pending").replaceAll("_", " ")}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink break-words">
          {assignment.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {assignment.courseTitle} · Due {assignment.dueDate} · Total {assignment.totalMarks} marks
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-lg font-bold text-ink">Instructions</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
          {assignment.instructions}
        </p>
      </section>

      {submission?.attempts && submission.attempts.length > 0 ? (
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-lg font-bold text-ink">Your attempts</h2>
          <ul className="mt-3 space-y-3">
            {[...submission.attempts].reverse().map((a) => (
              <li key={a.id} className="rounded-xl border border-line bg-cream p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-semibold">Attempt {a.attemptNumber}</span>
                  <Badge>{a.status.replaceAll("_", " ")}</Badge>
                </div>
                {a.feedback ? <p className="mt-2 text-muted">Feedback: {a.feedback}</p> : null}
                {a.obtainedMarks != null ? (
                  <p className="mt-1 font-semibold">
                    Marks: {a.obtainedMarks}/{assignment.totalMarks}
                  </p>
                ) : null}
                {a.fileId ? (
                  <a href={`/api/files/${a.fileId}`} className="mt-2 inline-block text-accent font-semibold">
                    Download file ↓
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canSubmit && !locked ? (
        <form onSubmit={submit} className="rounded-2xl border border-line bg-cream p-6 space-y-4">
          <h2 className="text-lg font-bold text-ink">
            {submission?.status === "resubmission_required" ? "Submit revision" : "Your submission"}
          </h2>
          {types.includes("written") ? (
            <div>
              <label className="text-sm font-semibold">Written answer</label>
              <textarea
                className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm"
                rows={6}
                value={writtenText}
                onChange={(e) => setWrittenText(e.target.value)}
              />
            </div>
          ) : null}
          {types.includes("url") ? (
            <div>
              <label className="text-sm font-semibold">URL / link</label>
              <input
                className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
          ) : null}
          {types.includes("file") || true ? (
            <div>
              <label className="text-sm font-semibold">File (optional, max 8MB)</label>
              <input
                type="file"
                className="mt-2 block w-full text-sm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="mt-1 text-xs text-muted">PDF, images, Word, ZIP, or text.</p>
            </div>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          <Button type="submit" variant="signal" disabled={saving}>
            {saving ? "Submitting…" : "Submit"}
          </Button>
        </form>
      ) : (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          Reviewed submissions are locked until your teacher requests a resubmission.
        </p>
      )}

      <section className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-lg font-bold text-ink">Latest teacher feedback</h2>
        {submission?.feedback || submission?.obtainedMarks != null ? (
          <div className="mt-3">
            <p className="text-sm leading-7 text-muted">{submission.feedback || "—"}</p>
            {submission.obtainedMarks != null ? (
              <p className="mt-3 text-sm font-bold text-ink">
                Marks: {submission.obtainedMarks}/{assignment.totalMarks}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">Feedback will appear here after review.</p>
        )}
      </section>
    </div>
  );
}
