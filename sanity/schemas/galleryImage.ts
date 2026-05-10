import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Caption', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true }, validation: (r) => r.required(), fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['food-distribution', 'skills-training', 'education', 'community', 'events'] } }),
    defineField({ name: 'dateTaken', title: 'Date Taken', type: 'date' }),
  ],
  preview: { select: { title: 'title', media: 'photo' } },
});
