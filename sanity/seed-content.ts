import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log('Seeding realistic placeholder content...');

  // Team Members (realistic Cameroonian names and roles)
  const teamMembers = [
    { _id: 'team-1', name: 'Pastor Emmanuel Tchami', role: 'Founder & Executive Director', bio: 'Pastor Emmanuel founded ADA in 2021 with a vision to serve the most vulnerable communities in Cameroon. With over 15 years of pastoral ministry, he leads the organization with compassion and integrity.', isActive: true, sortOrder: 1 },
    { _id: 'team-2', name: 'Grace Nkembe', role: 'Programs Director', bio: 'Grace oversees all six ADA programs across Cameroon. Her background in social work and community development ensures our programs create lasting impact.', isActive: true, sortOrder: 2 },
    { _id: 'team-3', name: 'Jean-Pierre Fotso', role: 'Operations Manager', bio: 'Jean-Pierre manages day-to-day operations, logistics, and volunteer coordination. His organizational skills keep our programs running smoothly across multiple communities.', isActive: true, sortOrder: 3 },
    { _id: 'team-4', name: 'Marie-Claire Ndongo', role: 'Community Outreach Lead', bio: 'Marie-Claire connects directly with widows and families in need. She identifies beneficiaries and ensures support reaches those who need it most.', isActive: true, sortOrder: 4 },
    { _id: 'team-5', name: 'Samuel Mbah', role: 'Education Program Coordinator', bio: 'Samuel manages our education initiatives, from school supply distribution to mentorship programs for orphaned children in Douala and rural areas.', isActive: true, sortOrder: 5 },
  ];

  for (const m of teamMembers) {
    await client.createOrReplace({ ...m, _type: 'teamMember' });
  }
  console.log(`✓ ${teamMembers.length} Team Members`);

  // Testimonials (realistic beneficiary stories)
  const testimonials = [
    { _id: 'testimonial-1', name: 'Amina N.', quote: 'After my husband passed, I did not know how I would feed my children. ADA provided food packages and enrolled me in tailoring training. Today I run a small shop and can support my family on my own.', location: 'Bamenda', program: 'Widow Support Program', isFeatured: true },
    { _id: 'testimonial-2', name: 'Marie F.', quote: 'ADA paid my school fees when my grandmother could not afford them. They gave me books, a uniform, and a mentor who checks on me every week. I want to become a nurse to help others.', location: 'Douala', program: 'Education for Orphans', isFeatured: true },
    { _id: 'testimonial-3', name: 'Esther K.', quote: 'The skills training program taught me hairdressing. ADA even helped me get my first set of tools. Now I have regular clients and I am saving to open my own salon.', location: 'Yaoundé', program: 'Young Women Empowerment', isFeatured: true },
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
  console.log('\nTo add photos: Go to https://ada-website.sanity.studio/ and upload images to Team Members and Gallery Images');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
