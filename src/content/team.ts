export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  expertise?: string;
  bio?: string;
  photo?: string;
};

export const team: TeamMember[] = [
  {
    slug: "tayyab-hanif",
    name: "Tayyab Hanif",
    role: "CEO",
    expertise: "Leadership · Strategy · Growth",
    bio: "Leads DMrush and keeps SEO, marketing, and delivery aligned to business outcomes.",
    photo: "/images/team/tayyab-hanif.png",
  },
  {
    slug: "usman-raza",
    name: "Usman Raza",
    role: "SEO Executive",
    expertise: "SEO · Search · Organic growth",
    bio: "Runs SEO execution so businesses get found for the searches that matter.",
    photo: "/images/team/usman-raza.png",
  },
  {
    slug: "najaf-khan",
    name: "Najaf Khan",
    role: "Marketing Executive",
    expertise: "Marketing · Campaigns · Brand",
    bio: "Handles marketing work across campaigns, messaging, and channel execution.",
    photo: "/images/team/najaf-khan.png",
  },
];
