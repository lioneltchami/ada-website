import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Caption', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true }, validation: (r) => r.required(), fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['food-distribution', 'skills-training', 'education', 'community', 'events', 'health', 'clean-water'] } }),
    defineField({ name: 'project', title: 'Project', type: 'reference', to: [{ type: 'project' }], description: 'Which project is this photo from?' }),
    defineField({ name: 'year', title: 'Year', type: 'number', validation: (r) => r.min(2021).max(2030), description: 'Year the photo was taken' }),
    defineField({ name: 'dateTaken', title: 'Date Taken', type: 'date' }),
    defineField({ name: 'reportUrl', title: 'Project Report URL', type: 'url', description: 'Link to the project report PDF (Google Drive, Sanity file, etc.)' }),
  ],
  preview: {
    select: { title: 'title', media: 'photo', year: 'year' },
    prepare: ({ title, media, year }) => ({ title: `${title}${year ? ` (${year})` : ''}`, media }),
  },
});
