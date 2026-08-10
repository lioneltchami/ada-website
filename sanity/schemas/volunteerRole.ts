import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "volunteerRole",
  title: "Volunteer Role",
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
      description: frHint,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (French)",
      type: "text",
      description: frHint,
    }),
    defineField({
      name: "timeCommitment",
      title: "Time Commitment",
      type: "string",
    }),
    defineField({
      name: "timeCommitmentFr",
      title: "Time Commitment (French)",
      type: "string",
      description: frHint,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      options: { list: ["On-site", "Remote", "Hybrid"] },
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: { select: { title: "title", subtitle: "location" } },
});
