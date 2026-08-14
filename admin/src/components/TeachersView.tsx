import React, { useMemo, useState } from "react";
import { GraduationCap, Plus, KeyRound, Pencil, Trash2, Copy, Check } from "lucide-react";
import { useApp } from "../context/AppContext.js";
import type { Teacher } from "../types.js";

export const TeachersView: React.FC = () => {
  const {
    teachers,
    courses,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    resetTeacherPortalPassword,
    currentUser,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("Instructor");
  const [password, setPassword] = useState("");
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [creds, setCreds] = useState<{
    email: string;
    password: string;
    loginUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeCourses = useMemo(
    () => courses.filter((c) => c.status === "Active" && c.portalCourseId),
    [courses],
  );

  const resetForm = () => {
    setEditing(null);
    setName("");
    setEmail("");
    setPhone("");
    setRoleTitle("Instructor");
    setPassword("");
    setCourseIds([]);
    setIsActive(true);
    setError("");
    setShowForm(false);
  };

  const openEdit = (t: Teacher) => {
    setEditing(t);
    setName(t.name);
    setEmail(t.email);
    setPhone(t.phone);
    setRoleTitle(t.roleTitle);
    setPassword("");
    setCourseIds(t.courseIds);
    setIsActive(t.isActive);
    setShowForm(true);
    setError("");
  };

  const toggleCourse = (id: string) => {
    setCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const ok = await updateTeacher(editing.id, {
          name,
          email,
          phone,
          roleTitle,
          courseIds,
          isActive,
          ...(password.trim() ? { password: password.trim() } : {}),
        });
        if (!ok) {
          setError("Could not update teacher. Check email is unique and Learn portal is running.");
          return;
        }
        resetForm();
      } else {
        const result = await addTeacher({
          name,
          email,
          phone,
          roleTitle,
          courseIds,
          password: password.trim() || undefined,
          isActive,
        });
        if (!result) {
          setError("Could not create teacher. Is Learn portal running on port 3001?");
          return;
        }
        if (result.portalAccount?.provisioned && result.portalAccount.initialPassword) {
          setCreds({
            email: result.portalAccount.email || email,
            password: result.portalAccount.initialPassword,
            loginUrl: result.portalAccount.loginUrl || "http://localhost:3001/login",
          });
        }
        resetForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (t: Teacher) => {
    if (!window.confirm(`Reset Learn portal password for ${t.email}?`)) return;
    const result = await resetTeacherPortalPassword(t.id);
    if (!result) {
      alert("Password reset failed. Is Learn portal running?");
      return;
    }
    setCreds({
      email: result.email,
      password: result.initialPassword,
      loginUrl: result.loginUrl,
    });
  };

  const handleDelete = async (t: Teacher) => {
    if (!window.confirm(`Delete teacher ${t.name}? Their Learn portal login will be deactivated.`)) {
      return;
    }
    await deleteTeacher(t.id);
  };

  const copyCreds = async () => {
    if (!creds) return;
    await navigator.clipboard.writeText(
      `Login: ${creds.loginUrl}\nEmail: ${creds.email}\nPassword: ${creds.password}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isAdmin = currentUser?.role === "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Learn Portal</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Teachers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add instructors here — email/password will work on the Learn teacher panel.
          </p>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1a3324] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#244530]"
          >
            <Plus className="h-4 w-4" />
            Add Teacher
          </button>
        ) : null}
      </div>

      {creds ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-emerald-900">Teacher portal credentials</p>
              <p className="mt-2 text-sm text-emerald-800">
                Login URL: <span className="font-mono">{creds.loginUrl}</span>
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Email: <span className="font-mono font-semibold">{creds.email}</span>
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Password: <span className="font-mono font-semibold">{creds.password}</span>
              </p>
              <p className="mt-2 text-xs text-emerald-700">
                Save this password now — it is only shown after create/reset.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyCreds}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => setCreds(null)}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showForm && isAdmin ? (
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? "Edit teacher" : "New teacher"}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-500">Full name</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Login email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Phone</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Role title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500">
                Portal password {editing ? "(leave blank to keep current)" : "(optional — auto if empty)"}
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editing ? "••••••••" : "Auto-generate if empty"}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">Assigned courses</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {activeCourses.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={courseIds.includes(c.id)}
                    onChange={() => toggleCourse(c.id)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {editing ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active (can log in to teacher panel)
            </label>
          ) : null}

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#84cc16] px-4 py-2 text-sm font-bold text-[#0d1510] disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Create teacher"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Login email</th>
              <th className="px-4 py-3">Courses</th>
              <th className="px-4 py-3">Status</th>
              {isAdmin ? <th className="px-4 py-3">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 align-top">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a3324]/10 text-[#1a3324]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.roleTitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{t.email}</td>
                <td className="px-4 py-3 text-slate-600">
                  {t.courseIds
                    .map((id) => courses.find((c) => c.id === id)?.name || id)
                    .join(", ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      t.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                {isAdmin ? (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReset(t)}
                        className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                        title="Reset portal password"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t)}
                        className="rounded-md border border-slate-200 p-1.5 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-4 py-8 text-center text-sm text-slate-400">
                  No teachers yet. Admin can add instructors for the Learn teacher panel.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
