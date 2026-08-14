import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label="DM RUSH home">
      <Image
        src="/images/brand/dmrush-logo.png"
        alt="DM RUSH"
        width={1024}
        height={297}
        className="h-8 w-auto lg:h-9"
        priority
      />
    </Link>
  );
}
