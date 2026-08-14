"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { SafePortalStudent } from "@/lib/portal/types";

export function ProfilePasswordForm({ student }: { student: SafePortalStudent }) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
        return;
      }
      setError(data.message || "Could not update password.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-line pt-6">
      <div>
        <h2 className="text-lg font-bold text-ink">Change password</h2>
        <p className="mt-1 text-sm text-muted">
          Update your student portal login password anytime.
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold">Current password</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm"
          autoComplete="current-password"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">New password</label>
        <input
          type="password"
          required
          minLength={4}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Confirm new password</label>
        <input
          type="password"
          required
          minLength={4}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-3 text-sm"
          autoComplete="new-password"
        />
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-accent">{message}</p> : null}
      <Button type="submit" variant="signal" disabled={loading}>
        {loading ? "Saving…" : "Update password"}
      </Button>
      <p className="text-xs text-muted">Signed in as {student.email}</p>
    </form>
  );
}
