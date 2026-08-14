import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  /** Show "Learn" label beside the logo */
  showLearn?: boolean;
  /** Use white pill background (for dark surfaces) */
  onDark?: boolean;
  className?: string;
  imageClassName?: string;
  href?: string;
};

export function Logo({
  showLearn = false,
  onDark = false,
  className,
  imageClassName = "h-8 w-auto md:h-9",
  href = "/",
}: LogoProps) {
  const content = (
    <>
      <span
        className={cn(
          "inline-flex shrink-0 items-center",
          onDark && "rounded-lg bg-white px-2 py-1 shadow-sm",
        )}
      >
        <Image
          src="/images/brand/dmrush-logo.png"
          alt="DM RUSH"
          width={1024}
          height={297}
          className={imageClassName}
          priority
        />
      </span>
      {showLearn ? (
        <span className="text-lg font-bold tracking-[-0.03em] text-accent md:text-xl">Learn</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex shrink-0 items-center gap-2", className)}
        aria-label="DM RUSH Learn home"
      >
        {content}
      </Link>
    );
  }

  return <div className={cn("inline-flex shrink-0 items-center gap-2", className)}>{content}</div>;
}
