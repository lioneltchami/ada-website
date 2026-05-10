import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'donationTier',
  title: 'Donation Tier',
  type: 'document',
  fields: [
    defineField({ name: 'amount', title: 'Amount (USD)', type: 'number', validation: (r) => r.required().min(1) }),
    defineField({ name: 'impactDescription', title: 'Impact Description', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'impactDescription', subtitle: 'amount' }, prepare: ({ title, subtitle }) => ({ title, subtitle: `$${subtitle}` }) },
});
