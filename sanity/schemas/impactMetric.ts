import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'impactMetric',
  title: 'Impact Metric',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', title: 'Value', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'suffix', title: 'Suffix', type: 'string', description: 'e.g. "+" displayed after the number' }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});
