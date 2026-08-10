import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "missionStatementFr",
      title: "Mission Statement (French)",
      type: "text",
      rows: 4,
      description: frHint,
    }),
    defineField({
      name: "storyHeading",
      title: "Story Heading",
      type: "string",
    }),
    defineField({
      name: "storyHeadingFr",
      title: "Story Heading (French)",
      type: "string",
      description: frHint,
    }),
    defineField({
      name: "storyParagraphs",
      title: "Story Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "storyParagraphsFr",
      title: "Story Paragraphs (French)",
      type: "array",
      of: [{ type: "text" }],
      description: frHint,
    }),
    defineField({
      name: "coreValues",
      title: "Core Values",
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
    defineField({
      name: "programs",
      title: "Programs",
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
            {
              name: "slug",
              title: "Project Slug",
              type: "string",
              description:
                "Optional project page slug used for linking program cards.",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "financialSplit",
      title: "Financial Split",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "percentage", title: "Percentage", type: "number" },
            { name: "label", title: "Label", type: "string" },
            {
              name: "labelFr",
              title: "Label (French)",
              type: "string",
              description: frHint,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "year", title: "Year", type: "string" },
            { name: "event", title: "Event", type: "string" },
            {
              name: "eventFr",
              title: "Event (French)",
              type: "string",
              description: frHint,
            },
          ],
        },
      ],
    }),
  ],
});
