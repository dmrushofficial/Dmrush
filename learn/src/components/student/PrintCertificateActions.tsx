"use client";

import { Button } from "@/components/ui/Button";

export function PrintCertificateActions() {
  return (
    <div className="flex flex-wrap gap-3 no-print">
      <Button type="button" onClick={() => window.print()}>
        Print / Save as PDF
      </Button>
      <Button href="/student/certificates" variant="secondary">
        Back
      </Button>
    </div>
  );
}
