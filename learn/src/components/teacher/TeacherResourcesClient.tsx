"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Resource = { id: string; title: string; fileId: string };

export function TeacherResourcesClient({ courseId }: { courseId: string }) {
  const [items, setItems] = useState<Resource[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    fetch(`/api/resources?courseId=${encodeURIComponent(courseId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.success) setItems(d.resources || []);
      });
    return () => {
      alive = false;
    };
  }, [courseId]);

  const upload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setError("");
    setMessage("");
    const form = new FormData();
    form.set("courseId", courseId);
    form.set("title", title || file.name);
    form.set("file", file);
    const res = await fetch("/api/resources", { method: "POST", credentials: "include", body: form });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Upload failed");
      return;
    }
    setItems((prev) => [json.resource, ...prev]);
    setTitle("");
    setFile(null);
    setMessage("Resource uploaded.");
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
      <h2 className="text-lg font-bold text-ink">Course resources</h2>
      <p className="text-sm text-muted">
        Uploads are stored locally under <code>data/uploads</code> (dev). Replace the storage
        adapter for S3/R2 later.
      </p>
      <form onSubmit={upload} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input
          className="rounded-xl border border-line bg-cream px-3 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="file" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button type="submit" disabled={!file}>
          Upload
        </Button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-semibold break-words">{r.title}</span>
            <a href={`/api/files/${r.fileId}`} className="text-accent font-semibold">
              Download ↓
            </a>
          </li>
        ))}
        {items.length === 0 ? <p className="text-sm text-muted">No resources yet.</p> : null}
      </ul>
    </div>
  );
}
