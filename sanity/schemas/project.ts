import { archiveOutreachCategoryField } from "./archiveOutreachCategory";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "project",
	title: "Project",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "titleFr",
			title: "Title (French)",
			type: "string",
			description: "French translation. Leave blank to fall back to English.",
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title" },
			validation: (r) => r.required(),
		}),
		defineField({
			name: "status",
			title: "Status",
			type: "string",
			options: { list: ["active", "completed", "paused"] },
			validation: (r) => r.required(),
		}),
		archiveOutreachCategoryField(),
		defineField({
			name: "announcementOnly",
			title: "Announcement only",
			type: "boolean",
			initialValue: false,
			description: "Show the schedule and description without fundraising or participant totals.",
		}),
		defineField({
			name: "demographic",
			title: "Archive Demographic",
			type: "string",
			options: {
				list: [
					{ title: "Widows", value: "widows" },
					{ title: "Orphans", value: "orphans" },
					{ title: "Young Women", value: "young-women" },
					{ title: "Pregnant Women", value: "pregnant-women" },
					{ title: "IDPs", value: "idps" },
					{ title: "Community", value: "community" },
				],
			},
			description:
				"Optional audience label. Choose the outreach category separately for archive filtering.",
		}),
		defineField({
			name: "location",
			title: "Location",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "locationFr",
			title: "Location (French)",
			type: "string",
			description: "French translation. Leave blank to fall back to English.",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			validation: (r) => r.required().max(500),
		}),
		defineField({
			name: "descriptionFr",
			title: "Description (French)",
			type: "text",
			description: "French translation. Leave blank to fall back to English.",
			validation: (r) => r.max(500),
		}),
		defineField({
			name: "beneficiaries",
			title: "Beneficiaries",
			type: "number",
			validation: (r) => r.required().min(0),
		}),
		defineField({
			name: "goalAmount",
			title: "Goal Amount (USD)",
			type: "number",
			validation: (r) => r.required().min(0),
		}),
		defineField({
			name: "raisedAmount",
			title: "Raised Amount (USD)",
			type: "number",
			validation: (r) => r.required().min(0),
		}),
		defineField({
			name: "startDate",
			title: "Start Date",
			type: "date",
			description: "For a one-day project, set this date. The site can archive it automatically seven days later.",
		}),
		defineField({
			name: "endDate",
			title: "End Date",
			type: "date",
			description:
				"For a multi-day project, the site can archive it automatically seven days after this date.",
		}),
		defineField({
			name: "archiveAfterDate",
			title: "Legacy Archive After Date",
			type: "date",
			hidden: true,
		}),
		defineField({
			name: "autoArchiveAfterEndDate",
			title: "Automatically archive after one week",
			type: "boolean",
			initialValue: true,
			description:
				"On by default. Turn off only to keep the project out of automatic archiving.",
		}),
		defineField({
			name: "archiveRecord",
			title: "Archive Record",
			type: "reference",
			to: [{ type: "projectRecord" }],
			description:
				"Link this to the final project record once reports, outcomes, and archive documents are ready.",
		}),
		defineField({
			name: "mainImage",
			title: "Main Image",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Alt Text",
					type: "string",
					validation: (r) => r.required().max(160),
				}),
				defineField({
					name: "altFr",
					title: "Alt Text (French)",
					type: "string",
					description:
						"French translation. Leave blank to fall back to English.",
				}),
			],
		}),
		defineField({
			name: "isFeatured",
			title: "Featured",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "sortOrder",
			title: "Sort Order",
			type: "number",
			initialValue: 0,
		}),
	],
	preview: {
		select: { title: "title", subtitle: "status", media: "mainImage" },
	},
});
