"use client";

import { Button } from "@/components/ui/Button";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none transition-colors focus:border-accent";

export function ContactForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const lines = [
      `Name: ${String(data.get("name") || "").trim()}`,
      `Business: ${String(data.get("business") || "").trim()}`,
      `Email: ${String(data.get("email") || "").trim()}`,
      `Phone: ${String(data.get("phone") || "").trim()}`,
      `Service area: ${String(data.get("serviceArea") || "").trim()}`,
      `Interest: ${String(data.get("interest") || "").trim()}`,
      `Message: ${String(data.get("message") || "").trim()}`,
    ].filter((line) => !line.endsWith(": "));
    window.open(
      `${siteConfig.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="grid gap-5">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-ink">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={fieldClassName}
            required
          />
        </div>
        <div>
          <label htmlFor="business" className="text-sm font-semibold text-ink">
            Business name
          </label>
          <input
            id="business"
            name="business"
            type="text"
            autoComplete="organization"
            className={fieldClassName}
            required
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={fieldClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold text-ink">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={fieldClassName}
            />
          </div>
        </div>
        <div>
          <label htmlFor="service-area" className="text-sm font-semibold text-ink">
            Service area / market
          </label>
          <input
            id="service-area"
            name="serviceArea"
            type="text"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="interest" className="text-sm font-semibold text-ink">
            Primary interest
          </label>
          <select
            id="interest"
            name="interest"
            className={fieldClassName}
            defaultValue=""
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
            <option value="strategy-call">Strategy call</option>
            <option value="website-seo-audit">Website & SEO audit</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-semibold text-ink">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={fieldClassName}
            placeholder="What are you trying to improve?"
          />
        </div>
      </div>
      <div className="mt-8">
        <Button type="submit" variant="signal" size="lg">
          Send on WhatsApp →
        </Button>
      </div>
    </form>
  );
}
