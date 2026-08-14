"use client";

import { useEffect, useState } from "react";

type Ann = { id: string; title: string; body: string; courseTitle: string; createdAt: string };

export function StudentAnnouncementsClient() {
  const [items, setItems] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/announcements", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.success) setItems(d.announcements);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-ink">Announcements</h1>
        <p className="mt-2 text-sm text-muted">Updates from your instructors.</p>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
          No announcements yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                {item.courseTitle} · {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <h2 className="mt-2 text-lg font-bold text-ink">{item.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
