import { createClient } from '@sanity/client';

// Sample data must never be written to a live dataset.
const dataset = process.env.SANITY_DATASET;
if (dataset !== 'sandbox' && dataset !== 'development') {
  throw new Error('Set SANITY_DATASET to sandbox or development before loading sample content.');
}

const client = createClient({
  projectId: 'rj2m21gk',
  dataset,
  apiVersion: '2026-03-28',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log('Seeding realistic placeholder content...');

  // The production roster is curated; do not create sample team profiles.

  // Testimonials (realistic beneficiary stories)
  const testimonials = [
    { _id: 'testimonial-2', name: 'Marie F.', quote: 'ADA paid my school fees when my grandmother could not afford them. They gave me books, a uniform, and a mentor who checks on me every week. I want to become a nurse to help others.', location: 'Douala', program: 'Education for Orphans', isFeatured: true },
  ];

  for (const t of testimonials) {
    await client.createOrReplace({ ...t, _type: 'testimonial' });
  }
  console.log(`✓ ${testimonials.length} Testimonials`);

  // Gallery Images (metadata only - team uploads real photos in Studio)
  const galleryImages = [
    { _id: 'gallery-1', title: 'Food distribution to widows in Bamenda', category: 'food-distribution', dateTaken: '2024-03-15' },
    { _id: 'gallery-2', title: 'Skills training workshop - tailoring class', category: 'skills-training', dateTaken: '2024-04-20' },
    { _id: 'gallery-3', title: 'Back-to-school supply distribution', category: 'education', dateTaken: '2024-09-05' },
    { _id: 'gallery-4', title: 'Community clean-up drive in Bamenda', category: 'community', dateTaken: '2024-06-10' },
    { _id: 'gallery-5', title: 'Hospital visit - delivering medical supplies', category: 'community', dateTaken: '2024-02-28' },
    { _id: 'gallery-6', title: 'Women empowerment graduation ceremony', category: 'skills-training', dateTaken: '2024-07-15' },
    { _id: 'gallery-7', title: 'Christmas giving campaign 2024', category: 'events', dateTaken: '2024-12-20' },
    { _id: 'gallery-8', title: 'Education mentorship session', category: 'education', dateTaken: '2024-05-12' },
    { _id: 'gallery-9', title: 'Widow support group meeting', category: 'food-distribution', dateTaken: '2024-08-03' },
  ];

  for (const g of galleryImages) {
    await client.createOrReplace({ ...g, _type: 'galleryImage' });
  }
  console.log(`✓ ${galleryImages.length} Gallery Images (metadata only - upload photos in Studio)`);

  // Delete old sample placeholders
  const toDelete = ['team-sample-1', 'team-sample-2', 'team-sample-3', 'testimonial-sample-1', 'testimonial-sample-2'];
  for (const id of toDelete) {
    await client.delete(id).catch(() => {});
  }
  console.log('✓ Removed old placeholder samples');

  console.log('\n✅ Content seeding complete!');
  console.log('\nTotal documents in Sanity: ~40');
  console.log('\nSample data is for development only. Do not use it as evidence of an outreach or publish it.');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
