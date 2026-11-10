import { REGISTRATION_NUMBER } from "../data/organization";

export type FaqItem = {
  question: string;
  answer: string;
};

export type BlogPostingInput = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  category?: string;
  inLanguage?: "en" | "fr";
  blogName?: string;
  blogUrl?: string;
};

const ORG_LOGO = "https://apotidev.org/brand/ada-primary-lockup.png";
const ORG_URL = "https://apotidev.org";
const ORG_NAME = "Apoti Development Association";

function organizationPublisher() {
  return {
    "@type": "Organization" as const,
    name: ORG_NAME,
    url: ORG_URL,
    logo: {
      "@type": "ImageObject" as const,
      url: ORG_LOGO,
    },
  };
}

/** ISO date string suitable for schema.org (YYYY-MM-DD or full ISO). */
export function toSchemaDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function buildBlogPosting(input: BlogPostingInput) {
  const datePublished = toSchemaDate(input.datePublished);
  const dateModified =
    toSchemaDate(input.dateModified) || datePublished || undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    ...(input.imageUrl
      ? {
          image: [input.imageUrl],
        }
      : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Organization",
      name: ORG_NAME,
      url: ORG_URL,
    },
    publisher: organizationPublisher(),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    ...(input.category
      ? {
          articleSection: input.category,
        }
      : {}),
    isPartOf: {
      "@type": "Blog",
      name:
        input.blogName ||
        (input.inLanguage === "fr"
          ? "Témoignages & Actualités ADA"
          : "ADA Stories & Updates"),
      url:
        input.blogUrl ||
        (input.inLanguage === "fr"
          ? `${ORG_URL}/fr/stories`
          : `${ORG_URL}/stories`),
    },
  };
}

export function buildFaqPage(faqs: FaqItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Canonical donation FAQs (EN) — keep in sync with visible FAQ copy. */
export const DONATION_FAQS_EN: FaqItem[] = [
  {
    question: "Is my donation tax-deductible?",
    answer: `Donations to ADA are not tax-deductible in Canada, the US, the UK, or the EU. ADA is a registered NGO in Cameroon (${REGISTRATION_NUMBER}) and is not yet registered as a charity in any other jurisdiction. We issue receipts for personal records after gifts are confirmed. Many of our supporters give because they believe in the mission — and we are deeply grateful for every contribution, regardless of tax status.`,
  },
  {
    question: "How is my donation used?",
    answer:
      "ADA targets 80% program delivery, 15% program operations, and 5% administration. Executive leadership is volunteer-led, and paid roles are tied to program delivery needs.",
  },
  {
    question: "Can I donate to a specific project?",
    answer:
      "Yes! Select a project from the dropdown in the donation form. If no project is selected, your gift goes to our General Fund, which supports the most urgent needs across all programs.",
  },
  {
    question: "Can I cancel a monthly donation?",
    answer:
      "Absolutely. You can cancel your monthly donation at any time by emailing us at info@apotidev.org. There are no cancellation fees.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. All payments are processed by Stripe, a PCI-DSS Level 1 certified payment processor. ADA never stores your card details — they go directly to Stripe's secure servers.",
  },
];

export const DONATION_FAQS_FR: FaqItem[] = [
  {
    question: "Mon don est-il déductible d'impôt ?",
    answer: `Les dons à ADA ne sont pas déductibles d'impôt au Canada, aux États-Unis, au Royaume-Uni ou dans l'UE. ADA est une ONG enregistrée au Cameroun (${REGISTRATION_NUMBER}) et n'est pas encore enregistrée comme organisme de bienfaisance ailleurs. Nous délivrons des reçus pour vos dossiers personnels après confirmation du don.`,
  },
  {
    question: "Comment mon don est-il utilisé ?",
    answer:
      "ADA vise 80 % pour la mise en œuvre des programmes, 15 % pour les opérations de programme et 5 % pour l'administration. La direction exécutive est bénévole, et les postes rémunérés sont liés aux besoins de mise en œuvre.",
  },
  {
    question: "Puis-je donner pour un projet précis ?",
    answer:
      "Oui. Choisissez un projet dans le formulaire de don. Sans sélection, votre don va au Fonds général, qui soutient les besoins les plus urgents de tous les programmes.",
  },
  {
    question: "Puis-je annuler un don mensuel ?",
    answer:
      "Oui. Vous pouvez annuler à tout moment en écrivant à info@apotidev.org. Aucun frais d'annulation.",
  },
  {
    question: "Mes informations de paiement sont-elles sécurisées ?",
    answer:
      "Oui. Tous les paiements sont traités par Stripe (certifié PCI-DSS niveau 1). ADA ne stocke jamais vos coordonnées de carte — elles vont directement aux serveurs sécurisés de Stripe.",
  },
];

export const SPONSOR_FAQS_EN: FaqItem[] = [
  {
    question: "Is sponsorship tax-deductible?",
    answer: `ADA is registered in Cameroon (${REGISTRATION_NUMBER}). Contributions are not represented as tax-deductible in Canada, the United States, the United Kingdom, or the European Union unless a qualified registered partner is confirmed in writing. ADA can issue a receipt, invoice, or sponsorship confirmation for your records, but does not provide tax advice.`,
  },
  {
    question: "How does ADA use sponsor funds?",
    answer:
      "ADA targets 80% direct program delivery, with the remainder supporting program operations and administration. Sponsors receive clear options, written records, and updates appropriate to the sponsorship tier.",
  },
  {
    question: "What do sponsors receive?",
    answer:
      "Sponsor updates are quarterly and annual and include milestones and briefings. Any separate project or final report depends on the sponsorship agreement. Recognition is by preference and approval.",
  },
  {
    question: "How do I start a sponsorship?",
    answer:
      "Use the sponsor inquiry form to describe what you want to fund and any records you need. You can also state your preferred contact method; submitting a preference does not schedule a call.",
  },
  {
    question: "Where can I find registration and diligence documents?",
    answer:
      "ADA publishes a corporate sponsor one-pager, registration certificate, transparency materials, and project documentation on the site under Resources, Transparency, and Partners pages.",
  },
];

export const SPONSOR_FAQS_FR: FaqItem[] = [
  {
    question: "Le parrainage est-il déductible d'impôt ?",
    answer: `ADA est enregistrée au Cameroun (${REGISTRATION_NUMBER}). Les contributions ne sont pas présentées comme déductibles d'impôt au Canada, aux États-Unis, au Royaume-Uni ou dans l'UE sauf si un partenaire enregistré qualifié est confirmé par écrit. ADA peut fournir un reçu, une facture ou une confirmation de parrainage pour vos dossiers, mais ne donne pas de conseil fiscal.`,
  },
  {
    question: "Comment ADA utilise-t-elle les fonds des sponsors ?",
    answer:
      "ADA vise 80 % pour la mise en œuvre directe des programmes, le reste couvrant les opérations et l'administration. Les sponsors reçoivent des options claires, des documents écrits et des mises à jour adaptées au niveau de parrainage.",
  },
  {
    question: "Que reçoivent les sponsors ?",
    answer:
      "Les mises à jour des sponsors sont trimestrielles et annuelles et incluent des jalons et des points d'information. Tout rapport de projet ou rapport final distinct dépend de l'accord de parrainage. La reconnaissance se fait selon la préférence et avec approbation.",
  },
  {
    question: "Comment démarrer un parrainage ?",
    answer:
      "Utilisez le formulaire de demande de parrainage pour décrire ce que vous souhaitez financer et les documents dont vous avez besoin. Vous pouvez aussi indiquer votre moyen de contact préféré; une préférence pour un appel ne constitue pas un rendez-vous.",
  },
  {
    question: "Où trouver les documents d'enregistrement et de diligence ?",
    answer:
      "ADA publie une fiche sponsor, le certificat d'enregistrement, des documents de transparence et les dossiers de projets sur les pages Ressources, Transparence et Partenaires.",
  },
];
