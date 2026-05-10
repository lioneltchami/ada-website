import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log('Seeding Phase B...');

  // Home Page
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    heroBadge: 'Faith-Based Charity \u00b7 Cameroon',
    heroHeadline: 'Empowering Vulnerable Communities in Cameroon',
    heroSubtitle: 'Supporting widows, orphans, and young women through food distribution, skills training, healthcare, and education programs since 2021.',
    missionHeading: 'Our Mission',
    missionBody: 'To provide holistic support to vulnerable communities in Cameroon through faith-based programs that address immediate needs while building long-term self-sufficiency.',
    missionCards: [
      { _key: 'mc1', icon: '\ud83e\udd1d', title: 'Widow Support', description: 'Financial aid, skills training, and community for widows rebuilding their lives.' },
      { _key: 'mc2', icon: '\ud83d\udcda', title: 'Education', description: 'School supplies, tuition support, and mentorship for orphaned children.' },
      { _key: 'mc3', icon: '\ud83d\udcaa', title: 'Empowerment', description: 'Vocational training and microfinance for young women seeking independence.' },
    ],
    ctaHeading: 'Make a Difference Today',
    ctaBody: 'Every contribution helps us reach more vulnerable communities in Cameroon. Join us in building a brighter future.',
  });
  console.log('\u2713 Home Page');

  // About Page
  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    missionStatement: 'Shine the light of Jesus Christ by empowering vulnerable communities in Cameroon through food distribution, education, skills training, and healthcare programs that restore dignity and build self-sufficiency.',
    storyHeading: 'Called to Serve',
    storyParagraphs: [
      { _key: 'sp1', _type: 'text' },
    ],
    coreValues: [
      { _key: 'cv1', icon: '\u2764\ufe0f', title: 'Faith & Love', description: 'Grounded in Christian faith, we serve with unconditional love and compassion.' },
      { _key: 'cv2', icon: '\ud83d\ude4f', title: 'Dignity & Respect', description: 'Every person we serve is treated with the dignity they deserve as God\'s creation.' },
      { _key: 'cv3', icon: '\ud83c\udf31', title: 'Empowerment & Growth', description: 'We equip people with skills and resources to build their own futures.' },
      { _key: 'cv4', icon: '\ud83d\udd0d', title: 'Transparency & Integrity', description: 'We are accountable to our donors, partners, and the communities we serve.' },
      { _key: 'cv5', icon: '\ud83e\udd1d', title: 'Community Partnership', description: 'We work alongside local leaders and organizations for lasting impact.' },
      { _key: 'cv6', icon: '\u267b\ufe0f', title: 'Sustainable Impact', description: 'Our programs are designed to create long-term change, not temporary relief.' },
    ],
    programs: [
      { _key: 'p1', icon: '\ud83c\udf5a', title: 'Food Distribution', description: 'Regular food packages for widows and families in need.' },
      { _key: 'p2', icon: '\u2702\ufe0f', title: 'Skills Training', description: 'Vocational training in tailoring, hairdressing, and crafts for young women.' },
      { _key: 'p3', icon: '\ud83c\udfe5', title: 'Hospital Visits', description: 'Medical support and hospital visits for community members.' },
      { _key: 'p4', icon: '\ud83d\udcda', title: 'Back-to-School Support', description: 'School supplies, uniforms, and tuition for orphaned children.' },
      { _key: 'p5', icon: '\ud83d\udca7', title: 'Clean Water Initiative', description: 'Access to clean water for underserved communities.' },
      { _key: 'p6', icon: '\ud83e\uddf9', title: 'Community Clean-Up', description: 'Environmental stewardship through community clean-up drives.' },
    ],
    financialSplit: [
      { _key: 'fs1', percentage: 80, label: 'Direct Aid' },
      { _key: 'fs2', percentage: 15, label: 'Program Ops' },
      { _key: 'fs3', percentage: 5, label: 'Admin' },
    ],
    timeline: [
      { _key: 'tl1', year: '2021', event: 'Founded in Cameroon with a mission to serve the vulnerable' },
      { _key: 'tl2', year: '2022', event: 'Launched first Widow Support Program' },
      { _key: 'tl3', year: '2023', event: 'Orphan Care and Education program begins' },
      { _key: 'tl4', year: '2024', event: 'Expanded to 5 communities, 200+ lives impacted' },
    ],
  });
  console.log('\u2713 About Page');

  // FAQ Responses
  const faqs = [
    { _id: 'faq-programs', keywords: ['project', 'program', 'work'], response: 'ADA runs 6 programs: Food Distribution, Skills Training, Hospital Visits, Back-to-School, Clean Water, and Community Clean-Up.', sortOrder: 1 },
    { _id: 'faq-donate', keywords: ['donate', 'give', 'money'], response: 'Your donation makes a real difference. 80% goes directly to programs. Even $25 provides school supplies for 2 children.', sortOrder: 2 },
    { _id: 'faq-volunteer', keywords: ['volunteer', 'help', 'join'], response: 'We welcome volunteers in Cameroon and remotely! Roles include education mentoring, community outreach, and digital communications.', sortOrder: 3 },
    { _id: 'faq-contact', keywords: ['contact', 'email', 'phone'], response: 'Email info@apotidev.org or WhatsApp +237 676 282 346. Mon-Fri 8AM-5PM CAT.', sortOrder: 4 },
    { _id: 'faq-impact', keywords: ['impact', 'result'], response: 'Since 2021, we have impacted 200+ lives across 5 communities in Cameroon.', sortOrder: 5 },
  ];

  for (const faq of faqs) {
    await client.createOrReplace({ ...faq, _type: 'faqResponse' });
  }
  console.log(`\u2713 ${faqs.length} FAQ Responses`);

  console.log('\n\u2705 Phase B seeding complete!');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
