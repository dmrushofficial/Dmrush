import Image from "next/image";
import { cn } from "@/lib/cn";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  fillParent?: boolean;
};

export function Photo({
  src,
  alt,
  className,
  imageClassName,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  fillParent = false,
}: PhotoProps) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-accent-deep",
        fillParent ? "absolute inset-0" : "relative",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", imageClassName)}
        sizes={sizes}
        quality={80}
      />
    </div>
  );
}
