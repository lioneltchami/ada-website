import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import AnimatedCounter from '../components/AnimatedCounter';
import TestimonialCarousel from '../components/TestimonialCarousel';
import NewsletterSignup from '../components/NewsletterSignup';
import ImpactMap from '../components/ImpactMap';
import ProgressTracker from '../components/ProgressTracker';
import ImpactStories from '../components/ImpactStories';
import DonationTracker from '../components/DonationTracker';
import VolunteerSpotlight from '../components/VolunteerSpotlight';
import InteractiveButton from '../components/InteractiveButton';
import ParallaxSection from '../components/ParallaxSection';
import { Heart, Users, Globe, Lightbulb, ArrowRight, Award, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const featuredProjects = [
    {
      id: 'widow-support-program',
      title: "Widow Support Program",
      description: "Providing essential resources and training to widows in rural communities, helping them become self-sufficient and rebuild their lives with dignity.",
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "ongoing" as const,
      date: "March 2024",
      location: "Bamenda, Cameroon",
      beneficiaries: 45
    },
    {
      id: 'education-for-orphans',
      title: "Education for Orphans",
      description: "Sponsoring school fees and providing educational materials for orphaned children to ensure they have access to quality education.",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "completed" as const,
      date: "January 2024",
      location: "Douala, Cameroon",
      beneficiaries: 120
    },
    {
      id: 'young-women-empowerment',
      title: "Young Women Empowerment",
      description: "Skills training and mentorship program for young girls, focusing on vocational skills and entrepreneurship development.",
      image: "https://images.pexels.com/photos/5212662/pexels-photo-5212662.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "upcoming" as const,
      date: "May 2024",
      location: "Yaounde, Cameroon",
      beneficiaries: 80
    }
  ];

  const impactAreas = [
    {
      icon: Heart,
      title: "Supporting Widows",
      description: "Providing emotional support, resources, and training to help widows rebuild their lives and achieve independence."
    },
    {
      icon: Users,
      title: "Caring for Orphans",
      description: "Ensuring orphaned children receive education, healthcare, and the love they need to thrive and succeed."
    },
    {
      icon: Globe,
      title: "Community Development",
      description: "Organizing community clean-up initiatives and infrastructure projects that benefit everyone in our communities."
    },
    {
      icon: Lightbulb,
      title: "Youth Empowerment",
      description: "Training and mentoring young people with skills and opportunities to become leaders in their communities."
    }
  ];

  const testimonials = [
    {
      id: '1',
      name: 'Marie Fotso',
      role: 'Widow Support Program Beneficiary',
      location: 'Bamenda, Cameroon',
      image: 'https://images.pexels.com/photos/6646971/pexels-photo-6646971.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: 'After losing my husband, I thought my life was over. But ADA gave me hope and the skills to start my own small business. Now I can provide for my children with dignity.',
      rating: 5,
      project: 'Widow Support Program'
    },
    {
      id: '2',
      name: 'Jean-Baptiste Nkomo',
      role: 'Community Leader',
      location: 'Douala, Cameroon',
      image: 'https://images.pexels.com/photos/6646970/pexels-photo-6646970.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: 'The education program has transformed our community. Children who had no hope of attending school are now excelling in their studies. ADA truly understands our needs.',
      rating: 5,
      project: 'Education for Orphans'
    },
    {
      id: '3',
      name: 'Grace Mbah',
      role: 'Youth Program Graduate',
      location: 'Yaounde, Cameroon',
      image: 'https://images.pexels.com/photos/6647005/pexels-photo-6647005.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: 'The skills training program changed my life completely. I learned tailoring and now I have my own shop. I\'m even training other young women in my community through ADA!',
      rating: 5,
      project: 'Young Women Empowerment'
    }
  ];

  const goals2024 = [
    {
      id: '1',
      title: 'Support 200 Widows',
      description: 'Provide comprehensive support including skills training, resources, and mentorship to 200 widows across Cameroon through ADA.',
      target: 200,
      current: 145,
      unit: 'widows supported',
      deadline: 'December 2024',
      status: 'in-progress' as const,
      color: 'primary' as const
    },
    {
      id: '2',
      title: 'Educate 300 Orphans',
      description: 'Sponsor education for 300 orphaned children, including school fees, materials, and after-school support through ADA programs.',
      target: 300,
      current: 280,
      unit: 'children educated',
      deadline: 'December 2024',
      status: 'in-progress' as const,
      color: 'secondary' as const
    },
    {
      id: '3',
      title: 'Train 150 Young Women',
      description: 'Provide vocational training and entrepreneurship skills to 150 young women aged 16-25 through ADA initiatives.',
      target: 150,
      current: 95,
      unit: 'women trained',
      deadline: 'November 2024',
      status: 'in-progress' as const,
      color: 'accent' as const
    },
    {
      id: '4',
      title: 'Clean 50 Communities',
      description: 'Organize community clean-up initiatives in 50 different neighborhoods and villages through ADA volunteers.',
      target: 50,
      current: 50,
      unit: 'communities cleaned',
      deadline: 'October 2024',
      status: 'completed' as const,
      color: 'primary' as const
    }
  ];

  const impactStories = [
    {
      id: '1',
      name: 'Amina Hassan',
      age: 34,
      location: 'Bamenda, Cameroon',
      program: 'Widow Support Program',
      beforeStory: 'After losing her husband, Amina struggled to feed her three children. She had no income and felt hopeless about the future.',
      afterStory: 'Through ADA\'s program, Amina learned tailoring skills and received a small business loan. She now runs a successful tailoring shop and employs two other women.',
      quote: 'ADA didn\'t just give me skills, they gave me back my dignity and hope for the future.',
      image: 'https://images.pexels.com/photos/6646971/pexels-photo-6646971.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: [
        { label: 'Monthly Income', before: '$0', after: '$180' },
        { label: 'Children in School', before: '0/3', after: '3/3' }
      ],
      tags: ['widow support', 'entrepreneurship', 'family empowerment']
    },
    {
      id: '2',
      name: 'Emmanuel Tabi',
      age: 16,
      location: 'Douala, Cameroon',
      program: 'Education for Orphans',
      beforeStory: 'Emmanuel lost both parents and was living with his elderly grandmother who couldn\'t afford school fees. He was working odd jobs instead of attending school.',
      afterStory: 'ADA sponsored Emmanuel\'s education and provided mentorship. He\'s now top of his class and dreams of becoming a doctor to help his community.',
      quote: 'Education is the greatest gift anyone can give. ADA gave me a future I never thought possible.',
      image: 'https://images.pexels.com/photos/6646970/pexels-photo-6646970.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: [
        { label: 'School Attendance', before: '0%', after: '98%' },
        { label: 'Academic Rank', before: 'N/A', after: 'Top 5%' }
      ],
      tags: ['education', 'orphan support', 'academic excellence']
    }
  ];

  const donationGoals = [
    {
      id: '1',
      title: 'Emergency Food Relief',
      description: 'Provide emergency food packages to 100 families affected by recent flooding in the Northwest Region.',
      targetAmount: 15000,
      currentAmount: 8750,
      deadline: 'End of Month',
      category: 'emergency' as const,
      donors: 127,
      recentDonations: [
        { amount: 250, donor: 'Sarah Johnson', message: 'Hope this helps families in need', timestamp: '2 hours ago' },
        { amount: 100, donor: 'Michael Chen', timestamp: '5 hours ago' },
        { amount: 500, donor: 'Anonymous', message: 'For the children', timestamp: '1 day ago' }
      ]
    },
    {
      id: '2',
      title: 'New School Construction',
      description: 'Build a new primary school in rural Bamenda to serve 200+ children who currently walk 5+ miles to school.',
      targetAmount: 50000,
      currentAmount: 23500,
      deadline: 'June 2024',
      category: 'project' as const,
      donors: 89,
      recentDonations: [
        { amount: 1000, donor: 'Global Education Fund', timestamp: '3 hours ago' },
        { amount: 150, donor: 'Emma Wilson', message: 'Every child deserves education', timestamp: '6 hours ago' }
      ]
    }
  ];

  const featuredVolunteers = [
    {
      id: '1',
      name: 'Dr. Patricia Mbong',
      role: 'Medical Volunteer',
      location: 'Yaounde, Cameroon',
      image: 'https://images.pexels.com/photos/6647005/pexels-photo-6647005.jpeg?auto=compress&cs=tinysrgb&w=400',
      joinDate: 'January 2022',
      hoursContributed: 340,
      projectsInvolved: ['Healthcare Access Program', 'Mobile Clinic Initiative', 'Health Education'],
      achievements: ['Treated 500+ patients', 'Trained 15 community health workers', 'Led vaccination campaign'],
      quote: 'Volunteering with ADA allows me to use my medical skills where they\'re needed most. Every patient we help is a life changed.',
      skills: ['General Medicine', 'Community Health', 'Medical Training', 'French/English'],
      impact: 'Dr. Mbong has been instrumental in our healthcare initiatives, providing medical care to over 500 patients in remote areas and training local health workers to continue the work long-term.'
    },
    {
      id: '2',
      name: 'James Ndikumana',
      role: 'Youth Mentor',
      location: 'Douala, Cameroon',
      image: 'https://images.pexels.com/photos/6646970/pexels-photo-6646970.jpeg?auto=compress&cs=tinysrgb&w=400',
      joinDate: 'March 2023',
      hoursContributed: 180,
      projectsInvolved: ['Young Women Empowerment', 'Education for Orphans', 'Skills Training'],
      achievements: ['Mentored 25 young people', 'Organized 3 career workshops', 'Created youth leadership program'],
      quote: 'Working with young people gives me hope for the future. When we invest in youth, we invest in tomorrow.',
      skills: ['Youth Development', 'Career Counseling', 'Leadership Training', 'Public Speaking'],
      impact: 'James has mentored over 25 young people, helping them develop leadership skills and career paths. His youth leadership program has become a model for other communities.'
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Animated Impact Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ADA's Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every number represents a life touched, a community strengthened, and hope restored through ADA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCounter
              end={545}
              label="Lives Impacted"
              icon={Users}
              color="primary"
            />
            <AnimatedCounter
              end={28}
              label="Projects Completed"
              icon={Heart}
              color="secondary"
            />
            <AnimatedCounter
              end={12}
              label="Communities Served"
              icon={Globe}
              color="accent"
            />
            <AnimatedCounter
              end={95}
              suffix="%"
              label="Funds to Programs"
              icon={Award}
              color="primary"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <ParallaxSection offset={50}>
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ADA's Mission & Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe in creating lasting change by addressing the root causes of poverty and inequality 
                in our communities. Every project ADA undertakes is designed to empower and uplift those who need it most.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area, index) => (
                <motion.div 
                  key={index} 
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <area.icon className="w-8 h-8 text-primary-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Impact Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImpactMap />
        </div>
      </section>

      {/* Donation Tracker */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DonationTracker goals={donationGoals} />
        </div>
      </section>

      {/* Featured Projects */}
      <ParallaxSection offset={30}>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured ADA Projects
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover some of our recent initiatives that are making a real difference 
                in the lives of vulnerable communities across Cameroon through ADA.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/projects">
                <InteractiveButton
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="group"
                >
                  View All ADA Projects
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </InteractiveButton>
              </Link>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* Impact Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImpactStories stories={impactStories} />
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressTracker goals={goals2024} title="ADA's 2024 Goals" />
        </div>
      </section>

      {/* Volunteer Spotlight */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VolunteerSpotlight volunteers={featuredVolunteers} />
        </div>
      </section>

      {/* Testimonials */}
      <ParallaxSection offset={40}>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      </ParallaxSection>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background animation */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full"
            animate={{
              x: [0, -80, 0],
              y: [0, -30, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join ADA in Making a Difference
          </motion.h2>
          <motion.p 
            className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your support can transform lives and build stronger communities through ADA. 
            Whether through donations, volunteering, or spreading awareness, every contribution matters.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/donate">
              <InteractiveButton
                variant="secondary"
                size="lg"
                icon={Heart}
              >
                Donate to ADA
              </InteractiveButton>
            </Link>
            <Link to="/contact">
              <InteractiveButton
                variant="outline"
                size="lg"
                icon={Handshake}
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Get Involved with ADA
              </InteractiveButton>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}