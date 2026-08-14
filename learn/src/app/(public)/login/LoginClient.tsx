"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(() => emailFromUrl.trim().toLowerCase());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const fallback = data.redirectTo || "/student/dashboard";
        const next = searchParams.get("next");
        const role = data.role as string | undefined;
        const safeNext =
          next &&
          ((role === "teacher" && next.startsWith("/teacher")) ||
            (role === "student" && next.startsWith("/student")))
            ? next
            : fallback;
        router.replace(safeNext);
        router.refresh();
        return;
      }
      setError(data.message || "Login failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-cream py-14 md:py-20">
      <Container className="mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm md:p-8">
          <div className="flex justify-center">
            <Logo showLearn imageClassName="h-9 w-auto" />
          </div>
          <p className="t-label mt-6 text-center text-accent">Student portal</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink">Student Login</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Students: use the email/password from admission. Teachers:{" "}
            <code className="text-xs">teacher@dmrush.com</code> / <code className="text-xs">teacher</code>.
            This is not the admin panel login.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted">
            Default password format: <span className="font-mono font-semibold">DM</span> + last 6
            digits of the student&apos;s phone number.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line px-3.5 py-3 text-sm"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line px-3.5 py-3 text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            <Button type="submit" variant="signal" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
