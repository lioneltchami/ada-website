import { defineType, defineField } from "sanity";

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
        "Used when this project appears in the project archive after its end date.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (r) => r.required().max(500),
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
    defineField({ name: "startDate", title: "Start Date", type: "date" }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description:
        "When this date passes, the website can treat an active project as completed.",
    }),
    defineField({
      name: "archiveAfterDate",
      title: "Archive After Date",
      type: "date",
      description:
        "Optional override for when the website should move this project out of active fundraising.",
    }),
    defineField({
      name: "autoArchiveAfterEndDate",
      title: "Auto-complete after end/archive date",
      type: "boolean",
      initialValue: true,
      description:
        "Turn off only when a project should remain active after its date passes.",
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
