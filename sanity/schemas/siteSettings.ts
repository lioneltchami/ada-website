import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'text', rows: 3 }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'contactPhone', title: 'Contact Phone', type: 'string' }),
    defineField({ name: 'officeHours', title: 'Office Hours', type: 'string' }),
    defineField({ name: 'socialFacebook', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'socialInstagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'socialTwitter', title: 'Twitter/X URL', type: 'url' }),
  ],
});
