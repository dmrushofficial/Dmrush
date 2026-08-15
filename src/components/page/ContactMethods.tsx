import { siteConfig } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.9-4.44 9.9-9.9C21.94 6.43 17.5 2 12.04 2Zm5.79 14.16c-.24.68-1.4 1.3-1.94 1.35-.5.04-1.12.06-1.81-.11-.42-.11-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1.01-2.41.24-.26.64-.37.86-.37h.62c.2 0 .47-.08.73.56.27.68.91 2.35.99 2.52.08.17.13.37.03.59-.1.23-.16.37-.31.57-.16.2-.33.44-.47.59-.16.17-.32.35-.14.68.18.34.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.51 1.54.33.16.52.13.71-.08.19-.2.81-.94 1.03-1.26.22-.32.43-.27.73-.16.3.1 1.9.9 2.23 1.06.33.17.55.25.63.38.08.14.08.79-.16 1.47Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function ContactMethods({
  email,
  compact = false,
}: {
  email: string;
  compact?: boolean;
}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

  const items = [
    {
      href: siteConfig.whatsappUrl,
      external: true,
      label: "WhatsApp",
      value: siteConfig.phoneDisplay,
      hint: "Fastest reply",
      icon: <WhatsAppIcon />,
      featured: true,
    },
    {
      href: `mailto:${email}`,
      external: false,
      label: "Email",
      value: email,
      hint: "We read every message",
      icon: <MailIcon />,
      featured: false,
    },
    {
      href: mapsUrl,
      external: true,
      label: "Visit the office",
      value: siteConfig.address,
      hint: "Pattoki · walk-ins welcome",
      icon: <PinIcon />,
      featured: false,
    },
  ];

  return (
    <ul className={`grid gap-4 ${compact ? "" : "md:grid-cols-3"}`}>
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            className={`group flex h-full flex-col rounded-[1.35rem] border p-5 transition-transform hover:-translate-y-0.5 ${
              item.featured
                ? "border-signal/40 bg-signal text-ink shadow-sm"
                : "border-line bg-surface text-ink"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                item.featured ? "bg-ink text-signal" : "bg-panel text-accent"
              }`}
            >
              {item.icon}
            </span>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">
              {item.label}
            </p>
            <p className="mt-2 text-base font-bold leading-6 tracking-[-0.02em]">{item.value}</p>
            <p className={`mt-auto pt-3 text-sm ${item.featured ? "text-ink/70" : "text-muted"}`}>
              {item.hint} →
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
