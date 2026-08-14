import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">
        The page you requested does not exist. Return home or contact DMrush.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back to home</Button>
        <Button href="/contact" variant="secondary">
          Contact
        </Button>
      </div>
    </Section>
  );
}
