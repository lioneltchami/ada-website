import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
	name: "homePage",
	title: "Home Page",
	type: "document",
	fields: [
		defineField({ name: "heroBadge", title: "Hero Badge", type: "string" }),
		defineField({
			name: "heroBadgeFr",
			title: "Hero Badge (French)",
			type: "string",
			description: frHint,
		}),
		defineField({
			name: "heroHeadline",
			title: "Hero Headline",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "heroHeadlineFr",
			title: "Hero Headline (French)",
			type: "string",
			description: frHint,
		}),
		defineField({
			name: "heroSubtitle",
			title: "Hero Subtitle",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "heroSubtitleFr",
			title: "Hero Subtitle (French)",
			type: "text",
			rows: 3,
			description: frHint,
		}),
		defineField({
			name: "missionHeading",
			title: "Mission Heading",
			type: "string",
		}),
		defineField({
			name: "missionHeadingFr",
			title: "Mission Heading (French)",
			type: "string",
			description: frHint,
		}),
		defineField({
			name: "missionBody",
			title: "Mission Body",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "missionBodyFr",
			title: "Mission Body (French)",
			type: "text",
			rows: 4,
			description: frHint,
		}),
		defineField({
			name: "missionCards",
			title: "Mission Cards",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "icon",
							title: "Icon (unused — leave blank)",
							type: "string",
							description: "Deprecated. Site no longer renders emoji icons.",
						},
						{ name: "title", title: "Title", type: "string" },
						{
							name: "titleFr",
							title: "Title (French)",
							type: "string",
							description: frHint,
						},
						{ name: "description", title: "Description", type: "text" },
						{
							name: "descriptionFr",
							title: "Description (French)",
							type: "text",
							description: frHint,
						},
					],
				},
			],
		}),
		defineField({ name: "ctaHeading", title: "CTA Heading", type: "string" }),
		defineField({
			name: "ctaHeadingFr",
			title: "CTA Heading (French)",
			type: "string",
			description: frHint,
		}),
		defineField({ name: "ctaBody", title: "CTA Body", type: "text", rows: 2 }),
		defineField({
			name: "ctaBodyFr",
			title: "CTA Body (French)",
			type: "text",
			rows: 2,
			description: frHint,
		}),
	],
});
