import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'volunteerRole',
  title: 'Volunteer Role',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', validation: (r) => r.required() }),
    defineField({ name: 'timeCommitment', title: 'Time Commitment', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string', options: { list: ['On-site', 'Remote', 'Hybrid'] } }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'title', subtitle: 'location' } },
});
