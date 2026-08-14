"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Ann = { id: string; title: string; body: string; courseTitle: string; createdAt: string };
type CourseOpt = { id: string; title: string };

export function TeacherAnnouncementsClient() {
  const [items, setItems] = useState<Ann[]>([]);
  const [courses, setCourses] = useState<CourseOpt[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/announcements", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/assignments", { credentials: "include" }).then((r) => r.json()),
    ]).then(([ann, asg]) => {
      if (!alive) return;
      if (ann.success) setItems(ann.announcements);
      if (asg.success) setCourses(asg.courses || []);
    });
    return () => {
      alive = false;
    };
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/announcements", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, courseId }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Failed");
      return;
    }
    setTitle("");
    setBody("");
    Promise.all([
      fetch("/api/announcements", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/assignments", { credentials: "include" }).then((r) => r.json()),
    ]).then(([ann, asg]) => {
      if (ann.success) setItems(ann.announcements);
      if (asg.success) setCourses(asg.courses || []);
    });
  };

  const remove = async (id: string) => {
    await fetch(`/api/announcements?id=${id}`, { method: "DELETE", credentials: "include" });
    Promise.all([
      fetch("/api/announcements", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/assignments", { credentials: "include" }).then((r) => r.json()),
    ]).then(([ann, asg]) => {
      if (ann.success) setItems(ann.announcements);
      if (asg.success) setCourses(asg.courses || []);
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Announcements</h1>
        <p className="mt-2 text-sm text-muted">Post updates for all students or a specific course.</p>
      </div>

      <form onSubmit={create} className="space-y-3 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold">New announcement</h2>
        <select
          className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="all">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <input
          className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
          rows={4}
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" variant="signal">
          Publish
        </Button>
      </form>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {item.courseTitle}
                </p>
                <h2 className="mt-1 text-lg font-bold">{item.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{item.body}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
