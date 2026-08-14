import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Student Login",
  description: "Sign in to the DMrush Learn student portal.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
