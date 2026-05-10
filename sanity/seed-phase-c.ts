import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log('Seeding Phase C samples...');

  // Sample Team Members (marked as inactive so they don't show on site)
  const teamMembers = [
    { _id: 'team-sample-1', name: '[Add Name]', role: '[Add Role, e.g. Executive Director]', bio: '[Add a 2-3 sentence bio about this person]', isActive: false, sortOrder: 1 },
    { _id: 'team-sample-2', name: '[Add Name]', role: '[Add Role, e.g. Programs Manager]', bio: '[Add a 2-3 sentence bio about this person]', isActive: false, sortOrder: 2 },
    { _id: 'team-sample-3', name: '[Add Name]', role: '[Add Role, e.g. Volunteer Coordinator]', bio: '[Add a 2-3 sentence bio about this person]', isActive: false, sortOrder: 3 },
  ];

  for (const m of teamMembers) {
    await client.createOrReplace({ ...m, _type: 'teamMember' });
  }
  console.log(`✓ ${teamMembers.length} Sample Team Members (inactive - edit and activate)`);

  // Sample Testimonials (marked as not featured so they don't show)
  const testimonials = [
    { _id: 'testimonial-sample-1', name: '[Beneficiary Name]', quote: '[Add their story or testimonial here - 2-4 sentences about how ADA helped them]', location: '[City/Village]', program: 'Widow Support Program', isFeatured: false },
    { _id: 'testimonial-sample-2', name: '[Beneficiary Name]', quote: '[Add their story or testimonial here]', location: '[City/Village]', program: 'Education for Orphans', isFeatured: false },
  ];

  for (const t of testimonials) {
    await client.createOrReplace({ ...t, _type: 'testimonial' });
  }
  console.log(`✓ ${testimonials.length} Sample Testimonials (not featured - edit and feature)`);

  console.log('\n✅ Phase C samples created!');
  console.log('\nNext steps for ADA team:');
  console.log('1. Go to https://ada-website.sanity.studio/');
  console.log('2. Edit the sample Team Members with real names, roles, bios, and photos');
  console.log('3. Set "Active" to true when ready to publish');
  console.log('4. Edit Testimonials with real stories (with consent)');
  console.log('5. Set "Featured" to true to show on the website');
  console.log('6. Upload Gallery photos under "Gallery Image" section');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
