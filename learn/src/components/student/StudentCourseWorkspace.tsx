"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Lesson = { id: string; title: string; duration: string; type: string };
type Module = { id: string; title: string; lessons: Lesson[] };

export function StudentCourseWorkspace({
  courseId,
  courseTitle,
  modules,
  initialCompletedIds,
  initialPercent,
  resources,
}: {
  courseId: string;
  courseTitle: string;
  modules: Module[];
  initialCompletedIds: string[];
  initialPercent: number;
  resources: Array<{ id: string; title: string; fileId: string }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompletedIds));
  const [percent, setPercent] = useState(initialPercent);
  const [activeLessonId, setActiveLessonId] = useState(
    modules[0]?.lessons[0]?.id || "",
  );
  const [error, setError] = useState("");

  const active =
    modules.flatMap((m) => m.lessons).find((l) => l.id === activeLessonId) ||
    modules[0]?.lessons[0];

  const toggleComplete = async (lessonId: string, complete: boolean) => {
    setError("");
    const res = await fetch("/api/progress", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, lessonId, complete }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Could not update progress.");
      return;
    }
    setCompleted(new Set(json.progress.completedLessonIds));
    setPercent(json.progress.percent);
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-panel px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Course progress</p>
            <p className="mt-1 text-sm text-muted">
              {completed.size} lessons completed · {percent}%
            </p>
          </div>
          <Badge tone="signal">{percent}%</Badge>
        </div>
        <ProgressBar value={percent} className="mt-3" />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Modules</p>
          <h1 className="mt-2 text-lg font-bold text-ink">{courseTitle}</h1>
          <div className="mt-4 space-y-4">
            {modules.map((module) => (
              <div key={module.id}>
                <p className="text-sm font-semibold text-ink">{module.title}</p>
                <ul className="mt-2 space-y-1">
                  {module.lessons.map((lesson) => {
                    const done = completed.has(lesson.id);
                    const activeItem = lesson.id === active?.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full rounded-lg px-2 py-2 text-left text-sm ${
                            activeItem ? "bg-cream text-ink" : "text-muted hover:bg-cream/60"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className="block text-ink/90">{lesson.title}</span>
                            {done ? <Badge tone="success">Done</Badge> : null}
                          </span>
                          <span className="mt-0.5 block text-xs capitalize text-muted/80">
                            {lesson.type} · {lesson.duration}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5 md:p-6">
            <div className="flex flex-wrap gap-2">
              <Badge tone="signal">Lesson</Badge>
              <Badge>{active?.type ?? "notes"}</Badge>
              {active && completed.has(active.id) ? <Badge tone="success">Completed</Badge> : null}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-ink">{active?.title ?? "Select a lesson"}</h2>
            <div className="mt-5 rounded-xl border border-line bg-cream p-5 text-sm leading-7 text-muted">
              <p>
                Use this lesson as your class notes checklist for <strong>{courseTitle}</strong>.
                Mark it complete after you finish the session work.
              </p>
            </div>
            {active ? (
              <div className="mt-5">
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    void toggleComplete(active.id, !completed.has(active.id))
                  }
                >
                  {completed.has(active.id) ? "Mark incomplete" : "Mark lesson complete"}
                </Button>
              </div>
            ) : null}
          </div>

          {resources.length > 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-lg font-bold text-ink">Course resources</h3>
              <ul className="mt-3 space-y-2">
                {resources.map((r) => (
                  <li key={r.id}>
                    <a
                      href={`/api/files/${r.fileId}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      {r.title} ↓
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
