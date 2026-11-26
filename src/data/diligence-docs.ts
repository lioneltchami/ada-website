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
		desc: "Blank worksheet for planning a future outreach budget. It does not report actual spending.",
		link: "/docs/diligence/ada-program-budget-template.pdf",
		external: true,
		meta: "PDF · template",
		icon: "",
	},
	{
		group: "sponsor",
		title: "Bamenda Girls Dignity Project Report",
		desc: "Example of a completed outreach report, with the activity and financial account for June 28 in Bamenda.",
		link: "/docs/projects/girls-dignity-menstrual-health-bamenda-jun-2026/report.pdf",
		external: true,
		meta: "PDF · June 2026",
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
		desc: "Modèle vierge en anglais pour préparer le budget d’une future action. Il ne présente pas les dépenses effectuées.",
		link: "/docs/diligence/ada-program-budget-template.pdf",
		external: true,
		meta: "PDF · modèle en anglais",
		icon: "",
	},
	{
		group: "sponsor",
		title: "Rapport du projet Dignité des filles à Bamenda",
		desc: "Exemple de rapport de projet terminé, en anglais, avec le bilan de l’action du 28 juin à Bamenda et son compte financier.",
		link: "/docs/projects/girls-dignity-menstrual-health-bamenda-jun-2026/report.pdf",
		external: true,
		meta: "PDF · juin 2026 · anglais",
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
