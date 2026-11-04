import type { Locale } from "../i18n";

export type DiligenceGroup = "legal" | "policies" | "sponsor" | "budgets";

export const DILIGENCE_GROUP_ORDER: DiligenceGroup[] = [
	"legal",
	"policies",
	"sponsor",
	"budgets",
];

export type DiligenceDoc = {
	group: DiligenceGroup;
	title: string;
	desc: string;
	link: string;
	external: boolean;
	meta?: string;
	icon?: string;
	action?: string;
};

const EN: DiligenceDoc[] = [
	{
		group: "legal",
		title: "Registration Certificate",
		desc: "Official Cameroon NGO registration certificate for sponsor files.",
		link: "/docs/diligence/ada-registration-certificate.pdf",
		external: true,
		meta: "PDF · legal record",
		icon: "",
	},
	{
		group: "legal",
		title: "Governance Overview",
		desc: "Board structure, oversight rhythm, finance authority, and document review path.",
		link: "/docs/diligence/ada-governance-overview.pdf",
		external: true,
		meta: "PDF · governance",
		icon: "",
	},
	{
		group: "policies",
		title: "Financial Management Policy",
		desc: "Internal controls, approvals, procurement, cash handling, and reporting standards.",
		link: "/docs/diligence/ada-financial-management-policy.pdf",
		external: true,
		meta: "PDF · policy",
		icon: "",
	},
	{
		group: "policies",
		title: "Safeguarding Policy",
		desc: "Child protection, consent, incident response, and community safety commitments.",
		link: "/docs/diligence/ada-safeguarding-policy.pdf",
		external: true,
		meta: "PDF · policy",
		icon: "",
	},
	{
		group: "policies",
		title: "Anti-Fraud & Gift Integrity",
		desc: "Conflict-of-interest, restricted-gift, anti-fraud, and reporting safeguards.",
		link: "/docs/diligence/ada-anti-fraud-gift-integrity-summary.pdf",
		external: true,
		meta: "PDF · policy summary",
		icon: "",
	},
	{
		group: "budgets",
		title: "Program Budget Template",
		desc: "Forwardable template showing the budget categories ADA uses for sponsored work.",
		link: "/docs/diligence/ada-program-budget-template.pdf",
		external: true,
		meta: "PDF · template",
		icon: "",
	},
	{
		group: "sponsor",
		title: "Bamenda Girls Dignity Brief",
		desc: "TOR, budget table, and reporting template for the June 27 girls outreach in Bamenda.",
		link: "/docs/diligence/ada-bamenda-girls-dignity-outreach.pdf",
		external: true,
		meta: "PDF · June 2026",
		icon: "",
	},
	{
		group: "budgets",
		title: "Public Budget Adjustments",
		desc: "Sponsor-facing budget cap sheet with archive figures, public targets, and adjustment notes.",
		link: "/docs/ada-public-budget-adjustments.xlsx",
		external: true,
		meta: "XLSX · spreadsheet",
		icon: "",
	},
	{
		group: "budgets",
		title: "Public Budget Adjustments PDF",
		desc: "Polished investor-grade PDF summary of the public budget cap sheet.",
		link: "/docs/ada-public-budget-adjustments.pdf",
		external: true,
		meta: "PDF · polished",
		icon: "",
	},
];

const FR: DiligenceDoc[] = [
	{
		group: "legal",
		title: "Certificat d'Enregistrement",
		desc: "Certificat officiel d'enregistrement ONG au Cameroun pour les dossiers sponsor.",
		link: "/docs/diligence/ada-registration-certificate.pdf",
		external: true,
		meta: "PDF · document légal",
		icon: "",
	},
	{
		group: "legal",
		title: "Aperçu de Gouvernance",
		desc: "Structure du conseil, supervision, autorité financière et revue documentaire.",
		link: "/docs/diligence/ada-governance-overview.pdf",
		external: true,
		meta: "PDF · gouvernance",
		icon: "",
	},
	{
		group: "policies",
		title: "Politique de Gestion Financière",
		desc: "Contrôles internes, approbations, achats, caisse et standards de rapport.",
		link: "/docs/diligence/ada-financial-management-policy.pdf",
		external: true,
		meta: "PDF · politique",
		icon: "",
	},
	{
		group: "policies",
		title: "Politique de Protection",
		desc: "Protection de l'enfance, consentement, réponse aux incidents et sécurité.",
		link: "/docs/diligence/ada-safeguarding-policy.pdf",
		external: true,
		meta: "PDF · politique",
		icon: "",
	},
	{
		group: "policies",
		title: "Anti-Fraude et Intégrité des Dons",
		desc: "Conflits d'intérêt, dons restreints, anti-fraude et mécanismes de signalement.",
		link: "/docs/diligence/ada-anti-fraud-gift-integrity-summary.pdf",
		external: true,
		meta: "PDF · résumé politique",
		icon: "",
	},
	{
		group: "budgets",
		title: "Modèle de Budget Programme",
		desc: "Modèle transférable montrant les catégories budgétaires utilisées par ADA.",
		link: "/docs/diligence/ada-program-budget-template.pdf",
		external: true,
		meta: "PDF · modèle",
		icon: "",
	},
	{
		group: "sponsor",
		title: "Brief Dignité des Filles de Bamenda",
		desc: "TDR, tableau budgétaire et modèle de rapport pour l'outreach du 27 juin à Bamenda.",
		link: "/docs/diligence/ada-bamenda-girls-dignity-outreach.pdf",
		external: true,
		meta: "PDF · juin 2026",
		icon: "",
	},
	{
		group: "budgets",
		title: "Ajustements Budgétaires Publics",
		desc: "Feuille de plafonds budgétaires avec chiffres d'archive, cibles publiques et notes.",
		link: "/docs/ada-public-budget-adjustments.xlsx",
		external: true,
		meta: "XLSX · tableur",
		icon: "",
	},
	{
		group: "budgets",
		title: "Ajustements Budgétaires Publics (PDF)",
		desc: "Résumé PDF soigné de la feuille de plafonds budgétaires publics.",
		link: "/docs/ada-public-budget-adjustments.pdf",
		external: true,
		meta: "PDF · résumé",
		icon: "",
	},
];

export function diligenceDocsFor(locale: Locale): DiligenceDoc[] {
	return locale === "fr" ? FR : EN;
}

export function groupDiligenceDocs(docs: DiligenceDoc[]) {
	return DILIGENCE_GROUP_ORDER.map((group) => ({
		group,
		docs: docs.filter((doc) => doc.group === group),
	})).filter((section) => section.docs.length > 0);
}
