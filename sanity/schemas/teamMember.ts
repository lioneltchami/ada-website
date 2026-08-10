import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "roleFr",
      title: "Role (French)",
      type: "string",
      description: frHint,
    }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
    defineField({
      name: "bioFr",
      title: "Bio (French)",
      type: "text",
      rows: 3,
      description: frHint,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Alt Text", type: "string" },
        { name: "altFr", title: "Alt Text (French)", type: "string" },
      ],
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
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
