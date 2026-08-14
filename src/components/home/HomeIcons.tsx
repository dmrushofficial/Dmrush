import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
};

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={cn("h-4 w-4 shrink-0", className)} aria-hidden="true">
      <path
        d="M3 8.5 6.5 12 13 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-hidden="true">
      <path
        d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-hidden="true">
      <path
        d="M6.5 4h3l1.5 4-2 1.2a11 11 0 0 0 5.8 5.8L17 13l4 1.5v3A2 2 0 0 1 19 19.4C10.6 18.2 5.8 13.4 4.6 5A2 2 0 0 1 6.5 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JobIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-hidden="true">
      <rect x="4" y="7" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-8 w-8", className)} aria-hidden="true">
      <rect x="4" y="5" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const stripIcons = [PinIcon, MapIcon, GlobeIcon, SearchIcon, PhoneIcon, JobIcon] as const;

export function StripIcon({ index, className }: { index: number; className?: string }) {
  const Icon = stripIcons[index % stripIcons.length];
  return <Icon className={className} />;
}

export function ServiceCardIcon({ index, className }: { index: number; className?: string }) {
  const icons = [
    () => (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    () => (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
        <rect x="3" y="5" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 19h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    () => (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
        <path d="M4 10v8h16v-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 7h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    () => (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  ] as const;
  const Icon = icons[(index - 1) % icons.length] ?? icons[0];
  return <Icon />;
}
