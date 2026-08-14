import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PublicShell } from "@/components/public/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <Container className="py-24 text-center">
        <p className="t-label text-accent">404</p>
        <h1 className="t-h2 mt-4 text-ink">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you requested does not exist. Return to the institute homepage or browse courses.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" variant="signal">
            Home
          </Button>
          <Button href="/courses" variant="secondary">
            Courses
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted">
          <Link href="/login" className="hover:text-accent">
            Student login demo
          </Link>
        </p>
      </Container>
    </PublicShell>
  );
}
