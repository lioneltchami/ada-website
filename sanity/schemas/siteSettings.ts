import { defineField, defineType } from "sanity";

const frHint = "French translation. Leave blank to fall back to English.";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 3 }),
    defineField({
      name: "taglineFr",
      title: "Tagline (French)",
      type: "text",
      rows: 3,
      description: frHint,
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({ name: "officeHours", title: "Office Hours", type: "string" }),
    defineField({
      name: "officeHoursFr",
      title: "Office Hours (French)",
      type: "string",
      description: frHint,
    }),
    defineField({ name: "socialFacebook", title: "Facebook URL", type: "url" }),
    defineField({
      name: "socialInstagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({ name: "socialTwitter", title: "Twitter/X URL", type: "url" }),
  ],
});
