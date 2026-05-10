import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['active', 'completed', 'paused'] }, validation: (r) => r.required() }),
    defineField({ name: 'location', title: 'Location', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', validation: (r) => r.required().max(500) }),
    defineField({ name: 'beneficiaries', title: 'Beneficiaries', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'goalAmount', title: 'Goal Amount (USD)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'raisedAmount', title: 'Raised Amount (USD)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'title', subtitle: 'status', media: 'mainImage' } },
});
