import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Target, CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

interface ProjectDetailData {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  date: string;
  location: string;
  beneficiaries: number;
  fullDescription: string;
  objectives: string[];
  timeline: Array<{
    phase: string;
    description: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    date: string;
  }>;
  impact?: {
    achieved: string[];
    metrics: Array<{
      label: string;
      value: string;
    }>;
  };
  challenges?: string[];
  lessons?: string[];
  improvements?: string[];
  futureGoals?: string[];
  gallery: string[];
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  // Project data - in a real app, this would come from an API or database
  const projectsData: Record<string, ProjectDetailData> = {
    'widow-support-program': {
      id: 'widow-support-program',
      title: 'Widow Support Program',
      description: 'Comprehensive support program providing resources, training, and emotional support to widows in rural communities.',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'ongoing',
      date: 'March 2024',
      location: 'Bamenda, Cameroon',
      beneficiaries: 45,
      fullDescription: 'The Widow Support Program is one of ADA\'s flagship initiatives, designed to provide comprehensive support to widows who have lost their primary source of income. This program addresses the multifaceted challenges faced by widows in rural Cameroon, including economic hardship, social isolation, and lack of access to resources.',
      objectives: [
        'Provide skills training in tailoring, farming, and small business management',
        'Offer emotional and psychological support through counseling services',
        'Create support networks among widows for mutual assistance',
        'Facilitate access to microfinance and small business loans',
        'Advocate for widows\' rights and social inclusion'
      ],
      timeline: [
        {
          phase: 'Program Launch',
          description: 'Initial assessment and recruitment of 30 widows',
          status: 'completed',
          date: 'March 2024'
        },
        {
          phase: 'Skills Training Phase 1',
          description: 'Basic tailoring and farming techniques training',
          status: 'completed',
          date: 'April 2024'
        },
        {
          phase: 'Business Development',
          description: 'Entrepreneurship training and business plan development',
          status: 'in-progress',
          date: 'May 2024'
        },
        {
          phase: 'Microfinance Access',
          description: 'Connecting widows with microfinance institutions',
          status: 'upcoming',
          date: 'June 2024'
        }
      ],
      impact: {
        achieved: [
          '45 widows enrolled in the program',
          '30 widows completed basic skills training',
          '15 small businesses established',
          '100% increase in average monthly income for participants'
        ],
        metrics: [
          { label: 'Widows Trained', value: '45' },
          { label: 'Businesses Started', value: '15' },
          { label: 'Average Income Increase', value: '100%' },
          { label: 'Support Groups Formed', value: '5' }
        ]
      },
      challenges: [
        'Limited access to markets for products created by widows',
        'Some participants struggled with literacy requirements for business training',
        'Transportation costs to training venues were higher than anticipated',
        'Cultural barriers in some communities regarding women\'s economic independence'
      ],
      lessons: [
        'Need to incorporate basic literacy training alongside skills development',
        'Importance of involving community leaders early in the process',
        'Mobile training units would be more effective than centralized locations',
        'Peer mentorship among widows accelerates learning and confidence building'
      ],
      improvements: [
        'Develop partnerships with local markets and cooperatives',
        'Create mobile training units to reduce transportation barriers',
        'Implement basic literacy programs as a prerequisite',
        'Establish a mentorship network with successful female entrepreneurs'
      ],
      gallery: [
        'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647005/pexels-photo-6647005.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6646971/pexels-photo-6646971.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    'education-for-orphans': {
      id: 'education-for-orphans',
      title: 'Education for Orphans',
      description: 'Sponsoring school fees, uniforms, and educational materials for orphaned children.',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'completed',
      date: 'January 2024',
      location: 'Douala, Cameroon',
      beneficiaries: 120,
      fullDescription: 'The Education for Orphans project was ADA\'s first major educational initiative, aimed at ensuring that orphaned children in Douala have access to quality education despite their challenging circumstances. This comprehensive program covered not just school fees but also provided holistic support for educational success.',
      objectives: [
        'Sponsor school fees for 120 orphaned children',
        'Provide school uniforms, books, and supplies',
        'Establish after-school tutoring programs',
        'Create mentorship opportunities with local professionals',
        'Monitor academic progress and provide additional support as needed'
      ],
      timeline: [
        {
          phase: 'Beneficiary Selection',
          description: 'Identification and verification of 120 orphaned children',
          status: 'completed',
          date: 'January 2024'
        },
        {
          phase: 'School Enrollment',
          description: 'Registration and fee payment for all beneficiaries',
          status: 'completed',
          date: 'February 2024'
        },
        {
          phase: 'Support Services',
          description: 'Implementation of tutoring and mentorship programs',
          status: 'completed',
          date: 'March 2024'
        },
        {
          phase: 'Academic Year Completion',
          description: 'End-of-year assessments and graduation ceremonies',
          status: 'completed',
          date: 'December 2024'
        }
      ],
      impact: {
        achieved: [
          '120 orphaned children completed full academic year',
          '95% attendance rate maintained throughout the year',
          '85% of students showed improved academic performance',
          '30 students received academic excellence awards'
        ],
        metrics: [
          { label: 'Children Educated', value: '120' },
          { label: 'Attendance Rate', value: '95%' },
          { label: 'Academic Improvement', value: '85%' },
          { label: 'Excellence Awards', value: '30' }
        ]
      },
      challenges: [
        'Some children faced emotional trauma that affected learning',
        'Irregular attendance due to family responsibilities',
        'Limited access to technology for modern learning methods',
        'Difficulty tracking children who moved between guardians'
      ],
      lessons: [
        'Psychological support is as important as academic support',
        'Need for flexible scheduling to accommodate family responsibilities',
        'Importance of building relationships with guardians and caregivers',
        'Technology access is crucial for competitive education'
      ],
      improvements: [
        'Integrate counseling services into the education program',
        'Develop weekend and evening study options',
        'Create a digital learning center with computer access',
        'Establish better communication systems with guardians'
      ],
      gallery: [
        'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6646970/pexels-photo-6646970.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6646969/pexels-photo-6646969.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    'young-women-empowerment': {
      id: 'young-women-empowerment',
      title: 'Young Women Empowerment',
      description: 'Skills training and mentorship program for young girls aged 16-25, focusing on vocational skills and entrepreneurship.',
      image: 'https://images.pexels.com/photos/5212662/pexels-photo-5212662.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'upcoming',
      date: 'May 2024',
      location: 'Yaounde, Cameroon',
      beneficiaries: 80,
      fullDescription: 'The Young Women Empowerment program will be ADA\'s most ambitious youth-focused initiative to date. Building on lessons learned from our previous programs, this comprehensive empowerment initiative will target young women aged 16-25 in Yaounde, providing them with the skills, confidence, and opportunities needed to become leaders in their communities.',
      objectives: [
        'Train 80 young women in high-demand vocational skills',
        'Provide entrepreneurship and business development training',
        'Establish mentorship relationships with successful female leaders',
        'Create networking opportunities and peer support groups',
        'Facilitate access to startup capital and business development resources'
      ],
      timeline: [
        {
          phase: 'Program Design & Recruitment',
          description: 'Finalize curriculum and recruit participants',
          status: 'upcoming',
          date: 'May 2024'
        },
        {
          phase: 'Skills Training Phase',
          description: 'Intensive vocational and soft skills training',
          status: 'upcoming',
          date: 'June - August 2024'
        },
        {
          phase: 'Entrepreneurship Development',
          description: 'Business plan development and pitch competitions',
          status: 'upcoming',
          date: 'September 2024'
        },
        {
          phase: 'Business Launch Support',
          description: 'Mentorship and funding support for business launches',
          status: 'upcoming',
          date: 'October 2024'
        }
      ],
      futureGoals: [
        'Achieve 90% completion rate for all training modules',
        'Support launch of at least 40 new businesses or career placements',
        'Establish a sustainable alumni network for ongoing support',
        'Create partnerships with local businesses for internship opportunities',
        'Develop a scholarship fund for continued education'
      ],
      gallery: [
        'https://images.pexels.com/photos/5212662/pexels-photo-5212662.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647004/pexels-photo-6647004.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    'community-cleanup': {
      id: 'community-cleanup',
      title: 'Community Clean-up Initiative',
      description: 'Monthly community clean-up drives involving local volunteers to maintain clean and healthy neighborhoods.',
      image: 'https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'ongoing',
      date: 'Ongoing',
      location: 'Multiple locations',
      beneficiaries: 200,
      fullDescription: 'The Community Clean-up Initiative represents ADA\'s commitment to environmental stewardship and community pride. This ongoing program mobilizes volunteers across multiple communities to maintain clean, healthy, and beautiful neighborhoods while fostering a sense of collective responsibility and community spirit.',
      objectives: [
        'Organize monthly clean-up drives in 10 different communities',
        'Engage 200+ volunteers in environmental stewardship activities',
        'Remove waste and debris from public spaces and waterways',
        'Educate communities about waste management and environmental protection',
        'Plant trees and create green spaces in urban areas'
      ],
      timeline: [
        {
          phase: 'Program Launch',
          description: 'First community clean-up drive in Bamenda',
          status: 'completed',
          date: 'January 2024'
        },
        {
          phase: 'Expansion Phase',
          description: 'Extended to 5 additional communities',
          status: 'completed',
          date: 'March 2024'
        },
        {
          phase: 'Full Implementation',
          description: 'Monthly drives in all 10 target communities',
          status: 'in-progress',
          date: 'Ongoing'
        },
        {
          phase: 'Sustainability Training',
          description: 'Community-led environmental education programs',
          status: 'in-progress',
          date: 'May 2024'
        }
      ],
      impact: {
        achieved: [
          '50+ successful clean-up drives completed',
          '200+ regular volunteers engaged',
          '15 tons of waste removed from communities',
          '500+ trees planted across all locations'
        ],
        metrics: [
          { label: 'Clean-up Drives', value: '50+' },
          { label: 'Active Volunteers', value: '200+' },
          { label: 'Waste Removed', value: '15 tons' },
          { label: 'Trees Planted', value: '500+' }
        ]
      },
      challenges: [
        'Inconsistent volunteer turnout during rainy season',
        'Limited access to proper waste disposal facilities',
        'Some community members resistant to change in waste habits',
        'Lack of government support for waste management infrastructure'
      ],
      lessons: [
        'Weather-appropriate scheduling is crucial for volunteer participation',
        'Education must accompany action for lasting behavioral change',
        'Local leadership buy-in is essential for program sustainability',
        'Partnerships with waste management companies improve effectiveness'
      ],
      improvements: [
        'Develop covered meeting spaces for rainy season activities',
        'Create partnerships with waste management companies',
        'Implement community reward systems for participation',
        'Advocate for improved municipal waste management services'
      ],
      gallery: [
        'https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    'healthcare-access': {
      id: 'healthcare-access',
      title: 'Healthcare Access Program',
      description: 'Mobile health clinics providing basic healthcare services, health education, and preventive care to underserved rural communities.',
      image: 'https://images.pexels.com/photos/6646921/pexels-photo-6646921.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'completed',
      date: 'December 2023',
      location: 'Rural Cameroon',
      beneficiaries: 300,
      fullDescription: 'The Healthcare Access Program was ADA\'s response to the critical healthcare gaps in rural Cameroon. This mobile clinic initiative brought essential medical services directly to communities that had limited or no access to healthcare facilities, providing both immediate care and long-term health education.',
      objectives: [
        'Provide basic medical care to 300+ individuals in remote areas',
        'Conduct health screenings and preventive care services',
        'Deliver health education on hygiene, nutrition, and disease prevention',
        'Distribute essential medications and medical supplies',
        'Train local health volunteers for ongoing community support'
      ],
      timeline: [
        {
          phase: 'Planning & Preparation',
          description: 'Medical team assembly and equipment procurement',
          status: 'completed',
          date: 'October 2023'
        },
        {
          phase: 'Mobile Clinic Deployment',
          description: 'First round of visits to 8 rural communities',
          status: 'completed',
          date: 'November 2023'
        },
        {
          phase: 'Follow-up Services',
          description: 'Return visits and specialized care referrals',
          status: 'completed',
          date: 'December 2023'
        },
        {
          phase: 'Program Evaluation',
          description: 'Impact assessment and community feedback collection',
          status: 'completed',
          date: 'January 2024'
        }
      ],
      impact: {
        achieved: [
          '350 individuals received medical consultations',
          '150 children received vaccinations',
          '80 cases referred to specialized care facilities',
          '25 local volunteers trained in basic health practices'
        ],
        metrics: [
          { label: 'Patients Treated', value: '350' },
          { label: 'Vaccinations Given', value: '150' },
          { label: 'Referrals Made', value: '80' },
          { label: 'Volunteers Trained', value: '25' }
        ]
      },
      challenges: [
        'Difficult terrain made some communities inaccessible during rainy season',
        'Limited medical supplies for the high demand encountered',
        'Language barriers in some remote communities',
        'Lack of follow-up care infrastructure for serious cases'
      ],
      lessons: [
        'Need for all-terrain vehicles and equipment for remote access',
        'Importance of local language interpreters in medical settings',
        'Community health workers are essential for program sustainability',
        'Partnerships with regional hospitals crucial for referral cases'
      ],
      improvements: [
        'Invest in better transportation equipment for difficult terrain',
        'Recruit multilingual medical staff and interpreters',
        'Establish formal partnerships with regional healthcare facilities',
        'Create a telemedicine system for remote consultations'
      ],
      gallery: [
        'https://images.pexels.com/photos/6646921/pexels-photo-6646921.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647004/pexels-photo-6647004.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    'agricultural-training': {
      id: 'agricultural-training',
      title: 'Agricultural Training Program',
      description: 'Teaching sustainable farming techniques and providing seeds and tools to help families achieve food security.',
      image: 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'upcoming',
      date: 'June 2024',
      location: 'Northwest Region',
      beneficiaries: 150,
      fullDescription: 'The Agricultural Training Program will be ADA\'s comprehensive approach to addressing food security and rural economic development. This program will combine traditional farming knowledge with modern sustainable techniques to help farming families increase their yields, improve their income, and achieve long-term food security.',
      objectives: [
        'Train 150 farmers in sustainable and modern farming techniques',
        'Provide improved seeds, tools, and farming equipment',
        'Establish demonstration farms for hands-on learning',
        'Create farmer cooperatives for collective marketing and purchasing',
        'Introduce climate-resilient crops and farming practices'
      ],
      timeline: [
        {
          phase: 'Farmer Recruitment & Assessment',
          description: 'Identify and register participating farmers',
          status: 'upcoming',
          date: 'June 2024'
        },
        {
          phase: 'Training Implementation',
          description: 'Intensive farming technique workshops and field training',
          status: 'upcoming',
          date: 'July - September 2024'
        },
        {
          phase: 'Demonstration Farm Setup',
          description: 'Establish model farms for ongoing learning',
          status: 'upcoming',
          date: 'August 2024'
        },
        {
          phase: 'Harvest & Evaluation',
          description: 'First harvest assessment and program evaluation',
          status: 'upcoming',
          date: 'December 2024'
        }
      ],
      futureGoals: [
        'Achieve 40% increase in crop yields for participating farmers',
        'Establish 5 farmer cooperatives for collective marketing',
        'Create a seed bank for sustainable agriculture',
        'Train 20 local agricultural extension workers',
        'Develop partnerships with agricultural research institutions'
      ],
      gallery: [
        'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    }
  };

  const project = projectsData[id || ''];

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary-600 hover:text-primary-700">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-yellow-100 text-yellow-800'
  };

  const timelineStatusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-blue-500',
    upcoming: 'bg-gray-300'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Projects
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{project.date}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900">{project.location}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div className="text-sm text-gray-600">Beneficiaries</div>
                    <div className="font-semibold text-gray-900">{project.beneficiaries}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-accent-600" />
                    </div>
                    <div className="text-sm text-gray-600">Timeline</div>
                    <div className="font-semibold text-gray-900">{project.date}</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {project.fullDescription}
                </p>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {project.status === 'upcoming' ? 'Planned Objectives' : 'Project Objectives'}
                </h3>
                <div className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h3>
                <div className="space-y-6">
                  {project.timeline.map((phase, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-4 h-4 rounded-full mt-2 ${timelineStatusColors[phase.status]}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                          <span className="text-sm text-gray-500">{phase.date}</span>
                        </div>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact & Results (for completed/ongoing projects) */}
              {project.impact && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Impact & Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Key Achievements</h4>
                      <div className="space-y-3">
                        {project.impact.achieved.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Impact Metrics</h4>
                      <div className="space-y-4">
                        {project.impact.metrics.map((metric, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-primary-600">{metric.value}</div>
                            <div className="text-gray-600">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Future Goals (for upcoming projects) */}
              {project.futureGoals && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Expected Outcomes</h3>
                  <div className="space-y-3">
                    {project.futureGoals.map((goal, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges & Lessons (for completed/ongoing projects) */}
              {(project.challenges || project.lessons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.challenges && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges Faced</h3>
                      <div className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.lessons && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Lessons Learned</h3>
                      <div className="space-y-3">
                        {project.lessons.map((lesson, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Lightbulb className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Improvements (for completed/ongoing projects) */}
              {project.improvements && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Future Improvements</h3>
                  <div className="space-y-3">
                    {project.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Gallery */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Gallery</h3>
                <div className="grid grid-cols-1 gap-4">
                  {project.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Support This Project */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Support This Project</h3>
                <p className="text-gray-600 mb-6">
                  Your donation can help us {project.status === 'upcoming' ? 'launch' : 'expand'} this important initiative and reach even more people in need.
                </p>
                <Link
                  to="/donate"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-center block"
                >
                  Donate Now
                </Link>
              </div>

              {/* Get Involved */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved</h3>
                <p className="text-gray-600 mb-6">
                  Want to volunteer or learn more about how you can contribute to this project?
                </p>
                <Link
                  to="/contact"
                  className="w-full border-2 border-primary-500 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 text-center block"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}