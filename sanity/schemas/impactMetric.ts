import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "impactMetric",
  title: "Impact Metric",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "labelFr",
      title: "Label (French)",
      type: "string",
      description: frHint,
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "suffix",
      title: "Suffix",
      type: "string",
      description: 'e.g. "+" displayed after the number',
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});
