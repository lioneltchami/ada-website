import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'faqResponse',
  title: 'FAQ Response',
  type: 'document',
  fields: [
    defineField({ name: 'keywords', title: 'Trigger Keywords', type: 'array', of: [{ type: 'string' }], validation: (r) => r.required() }),
    defineField({ name: 'response', title: 'Response Text', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'keywords', subtitle: 'response' }, prepare: ({ title, subtitle }) => ({ title: (title || []).join(', '), subtitle }) },
});
