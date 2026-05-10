import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'missionStatement', title: 'Mission Statement', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'storyHeading', title: 'Story Heading', type: 'string' }),
    defineField({ name: 'storyParagraphs', title: 'Story Paragraphs', type: 'array', of: [{ type: 'text' }] }),
    defineField({
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'icon', title: 'Icon (emoji)', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
      ]}],
    }),
    defineField({
      name: 'programs',
      title: 'Programs',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'icon', title: 'Icon (emoji)', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
      ]}],
    }),
    defineField({
      name: 'financialSplit',
      title: 'Financial Split',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'percentage', title: 'Percentage', type: 'number' },
        { name: 'label', title: 'Label', type: 'string' },
      ]}],
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'year', title: 'Year', type: 'string' },
        { name: 'event', title: 'Event', type: 'string' },
      ]}],
    }),
  ],
});
