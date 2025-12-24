import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Heart,
  Megaphone,
  Building2,
  Download,
  CheckCircle,
  Star,
  Mail,
  X,
  Send,
  Calendar,
  FileText
} from 'lucide-react';

export default function GetInvolved() {
  const [selectedVolunteerRole, setSelectedVolunteerRole] = useState('');
  const [selectedMembershipTier] = useState('');
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    experience: '',
    availability: '',
    skills: '',
    motivation: ''
  });
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    email: '',
    company: '',
    tier: ''
  });
  const [partnershipForm, setPartnershipForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    companySize: '',
    industry: '',
    interests: '',
    message: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    topics: ''
  });

  const volunteerRoles = [
    {
      id: 'community-outreach',
      title: 'Community Outreach Volunteer',
      description: 'Help us connect with communities and build relationships',
      requirements: ['Good communication skills', 'Cultural sensitivity', 'Local language proficiency'],
      timeCommitment: '4-6 hours per week',
      location: 'Field work in communities'
    },
    {
      id: 'education-support',
      title: 'Education Support Volunteer',
      description: 'Assist with tutoring, mentoring, and educational programs',
      requirements: ['Teaching or tutoring experience', 'Patience with children', 'Subject matter expertise'],
      timeCommitment: '3-5 hours per week',
      location: 'Schools and community centers'
    },
    {
      id: 'healthcare-assistant',
      title: 'Healthcare Assistant',
      description: 'Support mobile clinics and health education programs',
      requirements: ['Healthcare background preferred', 'First aid certification', 'Compassionate nature'],
      timeCommitment: '6-8 hours per week',
      location: 'Mobile clinics and rural areas'
    },
    {
      id: 'skills-trainer',
      title: 'Skills Training Instructor',
      description: 'Teach vocational skills to widows and young women',
      requirements: ['Expertise in specific trade', 'Teaching ability', 'Entrepreneurship knowledge'],
      timeCommitment: '5-7 hours per week',
      location: 'Training centers'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing Volunteer',
      description: 'Help with social media, content creation, and online outreach',
      requirements: ['Digital marketing experience', 'Content creation skills', 'Social media expertise'],
      timeCommitment: '3-4 hours per week',
      location: 'Remote work possible'
    },
    {
      id: 'fundraising-events',
      title: 'Fundraising & Events Coordinator',
      description: 'Organize events and coordinate fundraising activities',
      requirements: ['Event planning experience', 'Networking skills', 'Organizational abilities'],
      timeCommitment: '4-6 hours per week',
      location: 'Various event locations'
    }
  ];

  const membershipTiers = [
    {
      id: 'supporter',
      name: 'ADA Supporter',
      price: '$25/year',
      benefits: [
        'Quarterly newsletter with impact updates',
        'Access to member-only webinars',
        'Digital impact reports',
        'ADA supporter certificate'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'advocate',
      name: 'ADA Advocate',
      price: '$75/year',
      benefits: [
        'All Supporter benefits',
        'Exclusive behind-the-scenes content',
        'Priority event invitations',
        'ADA advocacy toolkit',
        'Direct updates from field teams'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'champion',
      name: 'ADA Champion',
      price: '$150/year',
      benefits: [
        'All Advocate benefits',
        'Annual impact call with leadership',
        'Personalized impact stories',
        'ADA champion recognition',
        'Input on new program development'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'ambassador',
      name: 'ADA Ambassador',
      price: '$300/year',
      benefits: [
        'All Champion benefits',
        'Annual field visit opportunity',
        'Direct beneficiary correspondence',
        'Ambassador advisory board participation',
        'Legacy naming opportunities'
      ],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const advocacyResources = [
    {
      title: 'ADA Impact Presentation',
      description: 'PowerPoint presentation showcasing our work and impact',
      format: 'PDF (15 slides)',
      size: '2.3 MB',
      downloadUrl: '#'
    },
    {
      title: 'Social Media Toolkit',
      description: 'Ready-to-share posts, images, and hashtags',
      format: 'ZIP file',
      size: '8.7 MB',
      downloadUrl: '#'
    },
    {
      title: 'Fact Sheet Collection',
      description: 'Key statistics and information about ADA programs',
      format: 'PDF (4 pages)',
      size: '1.1 MB',
      downloadUrl: '#'
    },
    {
      title: 'Video Stories Package',
      description: 'Short impact videos for sharing',
      format: 'MP4 files',
      size: '45 MB',
      downloadUrl: '#'
    },
    {
      title: 'Fundraising Guide',
      description: 'How to organize fundraising events for ADA',
      format: 'PDF (12 pages)',
      size: '2.8 MB',
      downloadUrl: '#'
    },
    {
      title: 'Speaker Notes',
      description: 'Talking points for presentations about ADA',
      format: 'PDF (6 pages)',
      size: '900 KB',
      downloadUrl: '#'
    }
  ];

  const corporatePartnershipTiers = [
    {
      name: 'Community Partner',
      investment: '$5,000 - $15,000',
      benefits: [
        'Logo on ADA website and materials',
        'Quarterly impact reports',
        'Employee volunteer opportunities',
        'Social media recognition'
      ]
    },
    {
      name: 'Program Sponsor',
      investment: '$15,000 - $50,000',
      benefits: [
        'All Community Partner benefits',
        'Named program sponsorship',
        'Executive site visit opportunity',
        'Custom impact measurement',
        'Press release collaboration'
      ]
    },
    {
      name: 'Strategic Alliance',
      investment: '$50,000+',
      benefits: [
        'All Program Sponsor benefits',
        'Board advisory participation',
        'Co-branded initiatives',
        'Thought leadership opportunities',
        'Multi-year partnership agreements'
      ]
    }
  ];

  // Form handlers
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert(`Thank you ${volunteerForm.name}! Your volunteer application for ${volunteerForm.role} has been submitted. We will contact you within 48 hours to discuss next steps.`);
    // Reset form
    setVolunteerForm({
      name: '', email: '', phone: '', role: '', experience: '', availability: '', skills: '', motivation: ''
    });
  };

  const handleMembershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTier = membershipTiers.find(t => t.id === membershipForm.tier);
    alert(`Thank you ${membershipForm.name}! Your ${selectedTier?.name} membership registration has been submitted. You will receive a payment link and welcome package via email within 24 hours.`);
    setShowMembershipModal(false);
    setMembershipForm({ name: '', email: '', company: '', tier: '' });
  };

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${partnershipForm.contactName}! Your partnership inquiry for ${partnershipForm.companyName} has been submitted. Our corporate partnerships team will contact you within 2 business days with a customized proposal.`);
    setShowPartnershipModal(false);
    setPartnershipForm({
      companyName: '', contactName: '', email: '', phone: '', companySize: '', industry: '', interests: '', message: ''
    });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${scheduleForm.name}! Your call request has been submitted. Our team will send you a calendar invitation within 24 hours for ${scheduleForm.preferredDate} at ${scheduleForm.preferredTime} (${scheduleForm.timezone}).`);
    setShowScheduleModal(false);
    setScheduleForm({
      name: '', email: '', company: '', phone: '', preferredDate: '', preferredTime: '', timezone: '', topics: ''
    });
  };

  const handleDownload = (resource: { title: string; format: string; size: string }) => {
    // Simulate download
    alert(`Downloading ${resource.title}... This would normally start a download of the ${resource.format} file (${resource.size}). Thank you for helping spread awareness about ADA's mission!`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, formType: string) => {
    const { name, value } = e.target;
    
    if (formType === 'volunteer') {
      setVolunteerForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'membership') {
      setMembershipForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'partnership') {
      setPartnershipForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'schedule') {
      setScheduleForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const openMembershipModal = (tierId: string) => {
    setMembershipForm(prev => ({ ...prev, tier: tierId }));
    setShowMembershipModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get Involved with ADA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the Apoti Development Association (ADA) family and become part of a movement that's 
              transforming lives across Cameroon. There are many ways to contribute to our mission.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ways to Get Involved Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Volunteer', description: 'Join our team of dedicated volunteers' },
              { icon: Heart, title: 'Become a Member', description: 'Get exclusive access and updates' },
              { icon: Megaphone, title: 'Advocate', description: 'Spread awareness about our mission' },
              { icon: Building2, title: 'Corporate Partnership', description: 'Partner with us for greater impact' }
            ].map((way, index) => (
              <motion.div
                key={index}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <way.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{way.title}</h3>
                <p className="text-gray-600">{way.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Sign-Up Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Volunteer with ADA
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Make a direct impact in communities across Cameroon. Choose a role that matches your skills and passion.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Volunteer Roles */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Volunteer Roles</h3>
                <div className="space-y-4">
                  {volunteerRoles.map((role) => (
                    <motion.div
                      key={role.id}
                      className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedVolunteerRole === role.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      onClick={() => setSelectedVolunteerRole(role.id)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{role.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Time:</span> {role.timeCommitment}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {role.location}
                        </div>
                      </div>
                      {selectedVolunteerRole === role.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-primary-200"
                        >
                          <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                          <ul className="space-y-1">
                            {role.requirements.map((req, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Volunteer Application Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Application</h3>
                <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={volunteerForm.name}
                        onChange={(e) => handleInputChange(e, 'volunteer')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={volunteerForm.email}
                        onChange={(e) => handleInputChange(e, 'volunteer')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={volunteerForm.phone}
                      onChange={(e) => handleInputChange(e, 'volunteer')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Role
                    </label>
                    <select
                      name="role"
                      required
                      value={volunteerForm.role}
                      onChange={(e) => handleInputChange(e, 'volunteer')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a role</option>
                      {volunteerRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relevant Experience
                    </label>
                    <textarea
                      name="experience"
                      rows={3}
                      value={volunteerForm.experience}
                      onChange={(e) => handleInputChange(e, 'volunteer')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us about your relevant experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={volunteerForm.availability}
                      onChange={(e) => handleInputChange(e, 'volunteer')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Weekends, Evenings, Flexible"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills & Expertise
                    </label>
                    <textarea
                      name="skills"
                      rows={3}
                      value={volunteerForm.skills}
                      onChange={(e) => handleInputChange(e, 'volunteer')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="What skills can you bring to ADA?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to volunteer with ADA?
                    </label>
                    <textarea
                      name="motivation"
                      rows={4}
                      required
                      value={volunteerForm.motivation}
                      onChange={(e) => handleInputChange(e, 'volunteer')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Share your motivation for joining ADA..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ADA Membership Program
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join our community of supporters and get exclusive access to impact updates, 
                behind-the-scenes content, and opportunities to shape our work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {membershipTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`bg-gradient-to-r ${tier.color} p-6 text-white text-center`}>
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold">{tier.price}</div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openMembershipModal(tier.id)}
                      className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        selectedMembershipTier === tier.id
                          ? `bg-gradient-to-r ${tier.color} text-white`
                          : 'border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600'
                      }`}
                    >
                      Select Plan
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advocacy Toolkit */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ADA Advocacy Toolkit
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Help spread awareness about ADA's mission with our comprehensive advocacy resources. 
                Download materials to share our story and impact with your network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advocacyResources.map((resource, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className="text-sm text-gray-500">{resource.size}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {resource.format}
                    </span>
                    <button 
                      onClick={() => handleDownload(resource)}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                How to Use the Advocacy Toolkit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Download Resources</h4>
                  <p className="text-gray-600 text-sm">Choose the materials that best fit your audience and platform.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customize & Share</h4>
                  <p className="text-gray-600 text-sm">Personalize the content and share it with your network.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Track Impact</h4>
                  <p className="text-gray-600 text-sm">Let us know how your advocacy efforts are going!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Corporate Partnerships with ADA
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Partner with ADA to create meaningful corporate social responsibility programs 
                that drive real impact in Cameroon while engaging your employees and stakeholders.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {corporatePartnershipTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-lg text-primary-600 font-semibold mb-6">{tier.investment}</div>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Partner with ADA?</h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Let's discuss how your organization can make a meaningful impact while achieving your CSR goals. 
                Our partnerships are designed to be mutually beneficial and create lasting change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowPartnershipModal(true)}
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request Partnership Info
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Call
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Journey with ADA Today
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Every form of involvement makes a difference. Choose the path that resonates with you 
              and join thousands of others who are creating positive change through ADA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('volunteer-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Start Volunteering
              </button>
              <button 
                onClick={() => openMembershipModal('supporter')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 flex items-center justify-center"
              >
                <Heart className="w-5 h-5 mr-2" />
                Become a Member
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Modal */}
      <AnimatePresence>
        {showMembershipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowMembershipModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Complete Membership Registration</h3>
                <button
                  onClick={() => setShowMembershipModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMembershipSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={membershipForm.name}
                    onChange={(e) => handleInputChange(e, 'membership')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={membershipForm.email}
                    onChange={(e) => handleInputChange(e, 'membership')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={membershipForm.company}
                    onChange={(e) => handleInputChange(e, 'membership')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Membership</label>
                  <select
                    name="tier"
                    required
                    value={membershipForm.tier}
                    onChange={(e) => handleInputChange(e, 'membership')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select membership tier</option>
                    {membershipTiers.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} - {tier.price}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                >
                  Complete Registration
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partnership Modal */}
      <AnimatePresence>
        {showPartnershipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPartnershipModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Partnership Information Request</h3>
                <button
                  onClick={() => setShowPartnershipModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePartnershipSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={partnershipForm.companyName}
                      onChange={(e) => handleInputChange(e, 'partnership')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      value={partnershipForm.contactName}
                      onChange={(e) => handleInputChange(e, 'partnership')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={partnershipForm.email}
                      onChange={(e) => handleInputChange(e, 'partnership')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={partnershipForm.phone}
                      onChange={(e) => handleInputChange(e, 'partnership')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      name="companySize"
                      value={partnershipForm.companySize}
                      onChange={(e) => handleInputChange(e, 'partnership')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select size</option>
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={partnershipForm.industry}
                      onChange={(e) => handleInputChange(e, 'partnership')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Interests</label>
                  <input
                    type="text"
                    name="interests"
                    value={partnershipForm.interests}
                    onChange={(e) => handleInputChange(e, 'partnership')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Employee volunteering, Program sponsorship, Skills-based volunteering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={partnershipForm.message}
                    onChange={(e) => handleInputChange(e, 'partnership')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell us more about your CSR goals and how you'd like to partner with ADA..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                >
                  Submit Partnership Request
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Call Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Schedule a Partnership Call</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={scheduleForm.name}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={scheduleForm.email}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={scheduleForm.company}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={scheduleForm.phone}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      required
                      value={scheduleForm.preferredDate}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                    <input
                      type="time"
                      name="preferredTime"
                      required
                      value={scheduleForm.preferredTime}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      name="timezone"
                      required
                      value={scheduleForm.timezone}
                      onChange={(e) => handleInputChange(e, 'schedule')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select timezone</option>
                      <option value="EST">EST (Eastern)</option>
                      <option value="CST">CST (Central)</option>
                      <option value="MST">MST (Mountain)</option>
                      <option value="PST">PST (Pacific)</option>
                      <option value="GMT">GMT (London)</option>
                      <option value="CET">CET (Central Europe)</option>
                      <option value="CAT">CAT (Central Africa)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topics to Discuss</label>
                  <textarea
                    name="topics"
                    rows={4}
                    value={scheduleForm.topics}
                    onChange={(e) => handleInputChange(e, 'schedule')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="What would you like to discuss during the call? (e.g., partnership opportunities, CSR goals, specific programs)"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Call
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}