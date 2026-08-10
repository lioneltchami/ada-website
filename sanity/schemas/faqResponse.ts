import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "faqResponse",
  title: "FAQ Response",
  type: "document",
  fields: [
    defineField({
      name: "keywords",
      title: "Trigger Keywords",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "response",
      title: "Response Text",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "responseFr",
      title: "Response Text (French)",
      type: "text",
      rows: 3,
      description: frHint,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "keywords", subtitle: "response" },
    prepare: ({ title, subtitle }) => ({
      title: (title || []).join(", "),
      subtitle,
    }),
  },
});
