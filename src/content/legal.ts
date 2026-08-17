import { siteConfig } from "@/lib/site";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalPage = {
  slug: "privacy" | "terms";
  path: string;
  title: string;
  description: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

const contactLine = `Questions about these policies: ${siteConfig.email} or WhatsApp ${siteConfig.phoneDisplay}.`;

export const legalPages: Record<LegalPage["slug"], LegalPage> = {
  privacy: {
    slug: "privacy",
    path: "/privacy",
    title: "Privacy Policy",
    description: `How ${siteConfig.name} collects, uses, and protects your information.`,
    effectiveDate: "17 August 2026",
    intro: `${siteConfig.name} ("we", "us") operates dmrush.com and provides SEO, web development, ecommerce, and digital marketing services. This policy explains what information we collect and how we use it.`,
    sections: [
      {
        title: "Information we collect",
        list: [
          "Contact details you submit — name, email, phone, company, and message content.",
          "Project and business information you share during consultations or engagements.",
          "Basic usage data from our website — pages visited, device/browser type, and approximate location from IP address.",
          "Communications with us by email, WhatsApp, or other channels you initiate.",
        ],
      },
      {
        title: "How we use information",
        list: [
          "Respond to inquiries and provide requested services.",
          "Prepare proposals, audits, invoices, and project deliverables.",
          "Improve our website, offers, and client communication.",
          "Meet legal, accounting, or security requirements when applicable.",
        ],
      },
      {
        title: "Cookies and analytics",
        paragraphs: [
          "Our site may use cookies and similar technologies to remember preferences and measure traffic. You can control cookies through your browser settings. Blocking cookies may affect some site features.",
        ],
      },
      {
        title: "Sharing and retention",
        paragraphs: [
          "We do not sell your personal information. We may share data with trusted service providers who help us run our website, analytics, email, or project tools — only as needed to deliver our services.",
          "We keep information for as long as needed to fulfill the purposes above, manage client relationships, and comply with applicable record-keeping requirements.",
        ],
      },
      {
        title: "Your choices",
        list: [
          "Request access, correction, or deletion of contact information we hold, subject to legal and contractual limits.",
          "Opt out of non-essential marketing messages at any time.",
          "Contact us if you have concerns about how your data is handled.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [contactLine, siteConfig.address],
      },
    ],
  },
  terms: {
    slug: "terms",
    path: "/terms",
    title: "Terms of Service",
    description: `Terms for using ${siteConfig.name} website and agency services.`,
    effectiveDate: "17 August 2026",
    intro: `These terms apply to your use of dmrush.com and to agency services provided by ${siteConfig.name}. By using our website or engaging our services, you agree to these terms.`,
    sections: [
      {
        title: "Services",
        paragraphs: [
          "DMrush provides digital growth services including SEO, web development, ecommerce, paid media, and related consulting. Scope, timelines, fees, and deliverables are defined in a written proposal, statement of work, or invoice — not solely by website marketing copy.",
        ],
      },
      {
        title: "Website use",
        list: [
          "Do not attempt to disrupt, scrape, or misuse the website or its content.",
          "Information on the site is for general guidance and may change without notice.",
          "Case studies and examples illustrate past work; results vary by industry, budget, and market conditions.",
        ],
      },
      {
        title: "Client responsibilities",
        list: [
          "Provide timely access, approvals, brand assets, and accurate business information needed for delivery.",
          "Maintain ownership and rights to materials you supply, and confirm you have permission to share them.",
          "Pay agreed fees according to the schedule in your proposal or invoice.",
        ],
      },
      {
        title: "Fees and payment",
        paragraphs: [
          "Unless otherwise agreed in writing, invoices are due as stated on the invoice. Late payment may pause work. Third-party costs — ads spend, domains, hosting, plugins, stock assets — are billed separately when applicable.",
        ],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "Upon full payment for a defined deliverable, client ownership of final agreed deliverables transfers as stated in the project agreement. DMrush retains the right to showcase non-confidential work in portfolios and marketing unless a mutual NDA says otherwise.",
        ],
      },
      {
        title: "Disclaimer",
        paragraphs: [
          "Search rankings, ad performance, leads, and revenue outcomes depend on many factors outside our control. We do not guarantee specific rankings, traffic levels, or revenue results unless explicitly stated in a signed agreement.",
        ],
      },
      {
        title: "Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, DMrush is not liable for indirect, incidental, or consequential damages arising from website use or services. Our total liability for any claim related to a project is limited to the fees paid for that project in the three months before the claim, unless a signed agreement states otherwise.",
        ],
      },
      {
        title: "Governing law",
        paragraphs: [
          "These terms are governed by the laws of Pakistan. Disputes should first be raised with us in good faith at the contact details below.",
          contactLine,
        ],
      },
    ],
  },
};
