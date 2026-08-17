import { siteConfig } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.9-4.44 9.9-9.9C21.94 6.43 17.5 2 12.04 2Zm5.79 14.16c-.24.68-1.4 1.3-1.94 1.35-.5.04-1.12.06-1.81-.11-.42-.11-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1.01-2.41.24-.26.64-.37.86-.37h.62c.2 0 .47-.08.73.56.27.68.91 2.35.99 2.52.08.17.13.37.03.59-.1.23-.16.37-.31.57-.16.2-.33.44-.47.59-.16.17-.32.35-.14.68.18.34.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.51 1.54.33.16.52.13.71-.08.19-.2.81-.94 1.03-1.26.22-.32.43-.27.73-.16.3.1 1.9.9 2.23 1.06.33.17.55.25.63.38.08.14.08.79-.16 1.47Z" />
    </svg>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp — ${siteConfig.phoneDisplay}`}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <WhatsAppIcon />
    </a>
  );
}
