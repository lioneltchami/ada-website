import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log('Seeding Sanity...');

  // Site Settings
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Apoti Development Association',
    tagline: 'Empowering vulnerable communities in Cameroon through faith-based programs supporting widows, orphans, and young women since 2021.',
    contactEmail: 'info@apotidev.org',
    contactPhone: '+237 676 282 346',
    officeHours: 'Mon\u2013Fri, 8AM\u20135PM CAT',
    socialFacebook: 'https://facebook.com/apotidev',
    socialInstagram: 'https://instagram.com/apotidev',
    socialTwitter: 'https://twitter.com/apotidev',
  });
  console.log('\u2713 Site Settings');

  // Projects
  const projects = [
    { _id: 'project-widow-support', slug: 'widow-support', title: 'Widow Support Program', status: 'active', location: 'Bamenda', description: 'Financial aid, food packages, and skills training for widows rebuilding their lives after loss. Our program provides monthly food supplies, vocational training in tailoring and hairdressing, and a supportive community network.', beneficiaries: 15, goalAmount: 8000, raisedAmount: 6500, sortOrder: 1 },
    { _id: 'project-education-orphans', slug: 'education-orphans', title: 'Education for Orphans', status: 'completed', location: 'Douala', description: 'Comprehensive education support for orphaned children including school supplies, uniforms, tuition fees, and mentorship programs. We believe every child deserves access to quality education regardless of their circumstances.', beneficiaries: 20, goalAmount: 7000, raisedAmount: 7000, sortOrder: 2 },
    { _id: 'project-women-empowerment', slug: 'women-empowerment', title: 'Young Women Empowerment', status: 'active', location: 'Yaound\u00e9', description: 'Vocational training and microfinance opportunities for young women seeking financial independence. Programs include tailoring, hairdressing, computer skills, and small business management.', beneficiaries: 10, goalAmount: 6000, raisedAmount: 3500, sortOrder: 3 },
    { _id: 'project-emergency-relief', slug: 'emergency-relief', title: 'Emergency Relief Fund', status: 'active', location: 'Multiple Regions', description: 'Rapid response fund for urgent community needs including emergency food distribution, medical assistance, and temporary shelter during crises.', beneficiaries: 50, goalAmount: 10000, raisedAmount: 4800, sortOrder: 4 },
    { _id: 'project-education-drive', slug: 'education-drive', title: 'Annual Education Drive', status: 'active', location: 'Rural Areas', description: 'Annual back-to-school campaign providing supplies, uniforms, and school fees for children in rural communities who would otherwise miss out on education.', beneficiaries: 20, goalAmount: 8000, raisedAmount: 2200, sortOrder: 5 },
    { _id: 'project-christmas-giving', slug: 'christmas-giving', title: 'Christmas Giving Campaign', status: 'paused', location: 'Bamenda & surrounding villages', description: 'Holiday season campaign bringing food packages, clothing, and gifts to families in need. A time to share love and joy with those who need it most.', beneficiaries: 50, goalAmount: 5000, raisedAmount: 1000, sortOrder: 6 },
  ];

  for (const p of projects) {
    await client.createOrReplace({ ...p, _type: 'project', slug: { _type: 'slug', current: p.slug } });
  }
  console.log(`\u2713 ${projects.length} Projects`);

  // Impact Metrics
  const metrics = [
    { _id: 'metric-lives', label: 'Lives Impacted', value: 200, suffix: '+', displayOrder: 1 },
    { _id: 'metric-communities', label: 'Communities Served', value: 5, suffix: '', displayOrder: 2 },
    { _id: 'metric-widows', label: 'Widows Supported', value: 15, suffix: '+', displayOrder: 3 },
    { _id: 'metric-years', label: 'Years of Service', value: 5, suffix: '', displayOrder: 4 },
  ];

  for (const m of metrics) {
    await client.createOrReplace({ ...m, _type: 'impactMetric' });
  }
  console.log(`\u2713 ${metrics.length} Impact Metrics`);

  // Volunteer Roles
  const roles = [
    { _id: 'role-outreach', title: 'Community Outreach Coordinator', description: 'Lead community engagement and program delivery.', timeCommitment: '10-15 hrs/week', location: 'On-site', sortOrder: 1 },
    { _id: 'role-mentor', title: 'Education Mentor', description: 'Tutor and mentor orphaned children in our education program.', timeCommitment: '5-10 hrs/week', location: 'On-site', sortOrder: 2 },
    { _id: 'role-trainer', title: 'Skills Training Facilitator', description: 'Teach vocational skills to young women.', timeCommitment: '8-12 hrs/week', location: 'On-site', sortOrder: 3 },
    { _id: 'role-health', title: 'Healthcare Support Volunteer', description: 'Assist with hospital visits and health awareness campaigns.', timeCommitment: '5-8 hrs/week', location: 'On-site', sortOrder: 4 },
    { _id: 'role-media', title: 'Digital Media & Communications', description: 'Manage social media, create content, and tell our story.', timeCommitment: '5-10 hrs/week', location: 'Remote', sortOrder: 5 },
    { _id: 'role-fundraising', title: 'Fundraising & Events', description: 'Help plan campaigns and coordinate fundraising events.', timeCommitment: 'Flexible', location: 'Remote', sortOrder: 6 },
  ];

  for (const r of roles) {
    await client.createOrReplace({ ...r, _type: 'volunteerRole', isActive: true });
  }
  console.log(`\u2713 ${roles.length} Volunteer Roles`);

  // Donation Tiers
  const tiers = [
    { _id: 'tier-25', amount: 25, impactDescription: 'School supplies for 2 children', sortOrder: 1 },
    { _id: 'tier-50', amount: 50, impactDescription: 'Widow support for a week', sortOrder: 2 },
    { _id: 'tier-100', amount: 100, impactDescription: 'Skills training for one woman', sortOrder: 3 },
    { _id: 'tier-250', amount: 250, impactDescription: 'Healthcare for 5 families', sortOrder: 4 },
    { _id: 'tier-500', amount: 500, impactDescription: 'Agricultural training for 3 farmers', sortOrder: 5 },
    { _id: 'tier-1000', amount: 1000, impactDescription: 'Community clean-up initiative', sortOrder: 6 },
  ];

  for (const t of tiers) {
    await client.createOrReplace({ ...t, _type: 'donationTier', isActive: true });
  }
  console.log(`\u2713 ${tiers.length} Donation Tiers`);

  console.log('\n\u2705 Seeding complete! 23 documents created.');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
