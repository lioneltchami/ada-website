import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "quoteFr",
      title: "Quote (French)",
      type: "text",
      description: frHint,
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "locationFr",
      title: "Location (French)",
      type: "string",
      description: frHint,
    }),
    defineField({ name: "program", title: "Program", type: "string" }),
    defineField({
      name: "programFr",
      title: "Program (French)",
      type: "string",
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
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "name", subtitle: "program", media: "photo" } },
});
