import type { TeamMemberSocial } from "@/content/team";
import { SocialIcon } from "@/components/ui/SocialIcons";

export function TeamSocialLinks({ social }: { social?: TeamMemberSocial[] }) {
  if (!social?.length) return null;

  return (
    <div className="mt-4 flex gap-2">
      {social.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-accent hover:text-accent"
        >
          <SocialIcon name={item.id} className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
