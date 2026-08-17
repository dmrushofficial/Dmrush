export type TeamMemberSocial = {
  id: "linkedin" | "instagram" | "youtube" | "facebook";
  href: string;
  label: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  expertise?: string;
  bio?: string;
  photo?: string;
  social?: TeamMemberSocial[];
};

export const team: TeamMember[] = [
  {
    slug: "tayyab-hanif",
    name: "Tayyab Hanif",
    role: "CEO",
    expertise: "Leadership · Strategy · Growth",
    bio: "Leads DMrush and keeps SEO, marketing, and delivery aligned to business outcomes.",
    photo: "/images/team/tayyab-hanif.png",
    social: [
      {
        id: "linkedin",
        href: "https://www.linkedin.com/in/muhammad-tayyab-b4a08125b",
        label: "Tayyab Hanif on LinkedIn",
      },
    ],
  },
  {
    slug: "usman-raza",
    name: "Usman Raza",
    role: "SEO Executive",
    expertise: "SEO · Search · Organic growth",
    bio: "Runs SEO execution so businesses get found for the searches that matter.",
    photo: "/images/team/usman-raza.png",
    social: [
      {
        id: "linkedin",
        href: "https://www.linkedin.com/in/usman-fadi-970588253",
        label: "Usman Raza on LinkedIn",
      },
    ],
  },
  {
    slug: "najaf-khan",
    name: "Najaf Khan",
    role: "Marketing Executive",
    expertise: "Marketing · Campaigns · Brand",
    bio: "Handles marketing work across campaigns, messaging, and channel execution.",
    photo: "/images/team/najaf-khan.png",
    social: [
      {
        id: "instagram",
        href: "https://www.instagram.com/najaf_khan286/",
        label: "Najaf Khan on Instagram",
      },
      {
        id: "facebook",
        href: "https://www.facebook.com/najaf.khan123",
        label: "Najaf Khan on Facebook",
      },
    ],
  },
];
