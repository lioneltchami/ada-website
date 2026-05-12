import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'projectRecord',
  title: 'Project Record',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'titleFr', title: 'Title (French)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'demographic',
      title: 'Target Demographic',
      type: 'string',
      options: { list: [
        { title: 'Widows', value: 'widows' },
        { title: 'Orphans', value: 'orphans' },
        { title: 'Young Women', value: 'young-women' },
        { title: 'Pregnant Women', value: 'pregnant-women' },
        { title: 'IDPs', value: 'idps' },
        { title: 'Community', value: 'community' },
      ]},
      validation: (r) => r.required(),
    }),
    defineField({ name: 'year', title: 'Year', type: 'number', validation: (r) => r.required().min(2021).max(2030) }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [
        { title: 'Completed', value: 'completed' },
        { title: 'Ongoing', value: 'ongoing' },
        { title: 'Planned', value: 'planned' },
      ]},
      validation: (r) => r.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'descriptionFr', title: 'Description (French)', type: 'text', rows: 4 }),
    defineField({ name: 'beneficiaries', title: 'Beneficiaries Reached', type: 'number' }),
    defineField({ name: 'budget', title: 'Budget (USD)', type: 'number' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({ name: 'termsOfReference', title: 'Terms of Reference (PDF)', type: 'file' }),
    defineField({ name: 'finalReport', title: 'Final Report (PDF)', type: 'file' }),
    defineField({ name: 'photo', title: 'Project Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'outcomes', title: 'Key Outcomes', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'outcomesFr', title: 'Key Outcomes (French)', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'demographic', year: 'year', status: 'status' },
    prepare({ title, subtitle, year, status }) {
      const icon = status === 'completed' ? '✓' : status === 'ongoing' ? '●' : '○';
      return { title: `${icon} ${title}`, subtitle: `${subtitle} · ${year}` };
    },
  },
  orderings: [{ title: 'Year (Newest)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] }],
});
