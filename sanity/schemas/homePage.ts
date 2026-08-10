import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", title: "Hero Badge", type: "string" }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "missionHeading",
      title: "Mission Heading",
      type: "string",
    }),
    defineField({
      name: "missionBody",
      title: "Mission Body",
      type: "text",
      rows: 4,
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
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({ name: "ctaHeading", title: "CTA Heading", type: "string" }),
    defineField({ name: "ctaBody", title: "CTA Body", type: "text", rows: 2 }),
  ],
});
