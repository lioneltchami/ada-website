import { defineField } from "sanity";
import {
  archiveOutreachCategoryIds,
  getArchiveOutreachCategory,
  getArchiveOutreachCategoryLabel,
  isArchiveOutreachCategory,
} from "../outreach-categories";

export function archiveOutreachCategoryField() {
  return defineField({
    name: "outreachCategory",
    title: "Outreach Category",
    type: "string",
    description: "Choose the main activity, not the audience. This controls the archive filter when a project is archived, including projects archived automatically.",
    options: {
      list: archiveOutreachCategoryIds.map((value) => ({
        title: getArchiveOutreachCategoryLabel(value, "en"),
        value,
      })),
    },
    validation: (rule) => rule.custom((value, { document }) => {
      if (isArchiveOutreachCategory(value)) return true;
      if (value) return "Choose a listed outreach category.";
      const slug = (document?.slug as { current?: string } | undefined)?.current;
      if (slug && getArchiveOutreachCategory(slug)) return true;
      return "Choose an outreach category before publishing.";
    }),
  });
}
