import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  CreditCard, 
  Shield, 
  Users, 
  Globe, 
  Award, 
  CheckCircle, 
  Gift,
  Repeat,
  Calendar,
  TrendingUp,
  Star,
  Download,
  Building2,
  Target,
  DollarSign
} from 'lucide-react';

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [donationType, setDonationType] = useState('one-time');
  const [customAmount, setCustomAmount] = useState('');
  const [giftType, setGiftType] = useState('monetary');
  const [showMatchingGifts, setShowMatchingGifts] = useState(false);

  const predefinedAmounts = ['25', '50', '100', '250', '500', '1000'];

  const giftTypes = [
    {
      id: 'monetary',
      title: 'Monetary Donation',
      description: 'Direct financial support for our programs',
      icon: DollarSign
    },
    {
      id: 'in-kind',
      title: 'In-Kind Donation',
      description: 'Goods, services, or equipment donations',
      icon: Gift
    },
    {
      id: 'legacy',
      title: 'Legacy Gift',
      description: 'Include ADA in your will or estate planning',
      icon: Award
    }
  ];

  const impactExamples = [
    {
      amount: '$25',
      impact: 'Provides school supplies for 2 orphaned children for one month',
      icon: '📚',
      category: 'Education'
    },
    {
      amount: '$50',
      impact: 'Supports a widow with basic necessities for one week',
      icon: '🏠',
      category: 'Widow Support'
    },
    {
      amount: '$100',
      impact: 'Funds skills training for one young woman',
      icon: '💡',
      category: 'Youth Empowerment'
    },
    {
      amount: '$250',
      impact: 'Supports a complete healthcare visit for 5 families',
      icon: '🏥',
      category: 'Healthcare'
    },
    {
      amount: '$500',
      impact: 'Provides agricultural training and tools for 3 farmers',
      icon: '🌱',
      category: 'Agriculture'
    },
    {
      amount: '$1000',
      impact: 'Funds a complete community clean-up initiative',
      icon: '🌍',
      category: 'Environment'
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your donation is processed securely with bank-level encryption'
    },
    {
      icon: CheckCircle,
      title: 'Transparent Use',
      description: '95% of donations go directly to programs and beneficiaries'
    },
    {
      icon: Award,
      title: 'Tax Deductible',
      description: 'All donations are tax deductible - receipt provided immediately'
    }
  ];

  const fundraisingGoals = [
    {
      title: 'Emergency Relief Fund',
      target: 25000,
      current: 18750,
      description: 'Support families affected by recent flooding',
      urgency: 'high'
    },
    {
      title: 'Education Expansion',
      target: 50000,
      current: 32000,
      description: 'Build new classrooms and sponsor 200 more children',
      urgency: 'medium'
    },
    {
      title: 'Healthcare Mobile Clinic',
      target: 75000,
      current: 45000,
      description: 'Purchase and equip a new mobile medical unit',
      urgency: 'low'
    }
  ];

  const majorDonors = [
    { name: 'Global Foundation', amount: '$50,000', type: 'Foundation' },
    { name: 'TechCorp International', amount: '$25,000', type: 'Corporate' },
    { name: 'Anonymous Donor', amount: '$15,000', type: 'Individual' },
    { name: 'Community Trust', amount: '$10,000', type: 'Foundation' },
    { name: 'Local Business Alliance', amount: '$8,500', type: 'Corporate' },
    { name: 'Dr. Sarah Johnson', amount: '$5,000', type: 'Individual' }
  ];

  const matchingGiftCompanies = [
    'Microsoft', 'Google', 'Apple', 'Amazon', 'IBM', 'Salesforce', 
    'Johnson & Johnson', 'Pfizer', 'Bank of America', 'Wells Fargo',
    'ExxonMobil', 'Chevron', 'General Electric', 'Boeing'
  ];

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    const type = giftType === 'monetary' ? 'monetary donation' : giftType === 'in-kind' ? 'in-kind donation' : 'legacy gift inquiry';
    
    if (giftType === 'legacy') {
      alert(`Thank you for your interest in legacy giving! Our development team will contact you within 24 hours to discuss planned giving options.`);
    } else if (giftType === 'in-kind') {
      alert(`Thank you for your interest in in-kind donations! Please contact us at donations@apotidevelopment.org to discuss your specific donation.`);
    } else {
      alert(`Thank you for your generous ${donationType} donation of $${amount}! You will be redirected to our secure payment processor.`);
    }
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
              Make a Difference Today
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your donation directly impacts vulnerable communities in Cameroon through ADA. 
              Join us in creating lasting change for widows, orphans, and young girls.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <motion.div 
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <indicator.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{indicator.title}</h3>
                  <p className="text-gray-600 text-sm">{indicator.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Thermometer */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Current Fundraising Goals
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                Help us reach our targets and make an even greater impact in our communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fundraisingGoals.map((goal, index) => {
                const percentage = (goal.current / goal.target) * 100;
                const urgencyColors = {
                  high: 'from-red-500 to-red-600',
                  medium: 'from-yellow-500 to-yellow-600',
                  low: 'from-green-500 to-green-600'
                };

                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>${goal.current.toLocaleString()}</span>
                        <span>${goal.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 bg-gradient-to-r ${urgencyColors[goal.urgency]} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-lg font-bold text-gray-900">{Math.round(percentage)}%</span>
                        <span className="text-gray-600 text-sm"> Complete</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Support This Goal
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Donation Form */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Your Donation</h2>
                </div>

                {/* Gift Type Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Type of Gift
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {giftTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setGiftType(type.id)}
                        className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                          giftType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <type.icon className={`w-5 h-5 ${
                            giftType === type.id ? 'text-primary-600' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">{type.title}</div>
                            <div className="text-sm text-gray-600">{type.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {giftType === 'monetary' && (
                  <>
                    {/* Donation Type */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Donation Frequency
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setDonationType('one-time')}
                          className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                            donationType === 'one-time'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <CreditCard className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-semibold">One-time</div>
                          <div className="text-sm text-gray-600">Make a single donation</div>
                        </button>
                        <button
                          onClick={() => setDonationType('monthly')}
                          className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                            donationType === 'monthly'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Repeat className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-semibold">Monthly</div>
                          <div className="text-sm text-gray-600">Recurring donation</div>
                        </button>
                      </div>
                    </div>

                    {/* Amount Selection */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Select Amount (USD)
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount('');
                            }}
                            className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 ${
                              selectedAmount === amount && !customAmount
                                ? 'border-primary-500 bg-primary-500 text-white'
                                : 'border-gray-300 hover:border-primary-300'
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
                          Or enter custom amount
                        </label>
                        <input
                          type="number"
                          id="custom-amount"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount('');
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    {/* Matching Gifts */}
                    <div className="mb-8">
                      <button
                        onClick={() => setShowMatchingGifts(!showMatchingGifts)}
                        className="flex items-center justify-between w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Double Your Impact with Matching Gifts</span>
                        </div>
                        <span className="text-blue-600">{showMatchingGifts ? '−' : '+'}</span>
                      </button>
                      
                      {showMatchingGifts && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-blue-50 rounded-lg"
                        >
                          <p className="text-blue-800 text-sm mb-3">
                            Many employers will match your donation, doubling your impact! Check if your company participates:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                            {matchingGiftCompanies.slice(0, 8).map((company, index) => (
                              <div key={index} className="flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {company}
                              </div>
                            ))}
                          </div>
                          <p className="text-blue-600 text-sm mt-3">
                            Contact your HR department or visit your company's matching gift portal.
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Donation Summary */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          {donationType === 'monthly' ? 'Monthly Donation:' : 'Donation Amount:'}
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                          ${customAmount || selectedAmount}
                        </span>
                      </div>
                      {donationType === 'monthly' && (
                        <p className="text-sm text-gray-600 mt-2">
                          You can cancel anytime. You'll receive email updates on your impact.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {giftType === 'in-kind' && (
                  <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">In-Kind Donation Information</h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      We accept donations of goods, services, and equipment that support our programs. 
                      Common in-kind donations include:
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1 mb-4">
                      <li>• Medical supplies and equipment</li>
                      <li>• Educational materials and books</li>
                      <li>• Agricultural tools and seeds</li>
                      <li>• Professional services (legal, accounting, marketing)</li>
                      <li>• Technology equipment</li>
                    </ul>
                    <p className="text-yellow-700 text-sm">
                      Please contact us at donations@apotidevelopment.org to discuss your specific donation.
                    </p>
                  </div>
                )}

                {giftType === 'legacy' && (
                  <div className="mb-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Legacy Giving Information</h3>
                    <p className="text-purple-700 text-sm mb-4">
                      Legacy gifts allow you to make a lasting impact on ADA's mission. Options include:
                    </p>
                    <ul className="text-purple-700 text-sm space-y-1 mb-4">
                      <li>• Bequests in your will</li>
                      <li>• Charitable remainder trusts</li>
                      <li>• Life insurance beneficiary designations</li>
                      <li>• Retirement account beneficiaries</li>
                      <li>• Charitable gift annuities</li>
                    </ul>
                    <p className="text-purple-700 text-sm">
                      Our development team will work with you and your advisors to create a plan that meets your goals.
                    </p>
                  </div>
                )}

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {giftType === 'monetary' && <CreditCard className="w-5 h-5" />}
                  {giftType === 'in-kind' && <Gift className="w-5 h-5" />}
                  {giftType === 'legacy' && <Award className="w-5 h-5" />}
                  <span>
                    {giftType === 'monetary' ? 'Donate Now - Secure Payment' : 
                     giftType === 'in-kind' ? 'Contact Us About In-Kind Donation' : 
                     'Learn About Legacy Giving'}
                  </span>
                </button>

                {giftType === 'monetary' && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Powered by Stripe. Your payment information is secure and encrypted.
                  </p>
                )}
              </div>

              {/* Impact Information */}
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-8 lg:p-12 text-white">
                <h3 className="text-2xl font-bold mb-6">Your Impact</h3>
                <p className="text-primary-100 mb-8">
                  Every dollar you donate goes directly toward creating meaningful change 
                  in the lives of those who need it most.
                </p>

                <div className="space-y-6">
                  {impactExamples.map((example, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="text-2xl">{example.icon}</div>
                      <div>
                        <div className="font-semibold text-lg">{example.amount}</div>
                        <p className="text-primary-100 text-sm mb-1">{example.impact}</p>
                        <span className="text-xs text-primary-200 bg-white/20 px-2 py-1 rounded">
                          {example.category}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <h4 className="font-semibold mb-4">Recent Impact</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-primary-100 text-sm">Lives Impacted</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">95%</div>
                      <div className="text-primary-100 text-sm">To Programs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donor Wall */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Wall of Appreciation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're grateful to these generous supporters who have made significant contributions to ADA's mission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majorDonors.map((donor, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {donor.type === 'Foundation' && <Award className="w-8 h-8 text-primary-600" />}
                    {donor.type === 'Corporate' && <Building2 className="w-8 h-8 text-secondary-600" />}
                    {donor.type === 'Individual' && <Users className="w-8 h-8 text-accent-600" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{donor.name}</h3>
                  <div className="text-2xl font-bold text-primary-600 mb-2">{donor.amount}</div>
                  <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                    {donor.type}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Want to join our Wall of Appreciation? Major donors ($5,000+) are recognized with permission.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                Learn About Major Giving →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tax Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tax Information</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Your donation to ADA may be tax-deductible. Here's what you need to know.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Deductibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">US Donors</p>
                        <p className="text-gray-600 text-sm">Donations are tax-deductible to the full extent allowed by law</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">International Donors</p>
                        <p className="text-gray-600 text-sm">Check with your local tax authority for deductibility rules</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Corporate Donations</p>
                        <p className="text-gray-600 text-sm">Business donations may qualify for corporate tax deductions</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Receipt & Documentation</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Download className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Instant Receipts</p>
                        <p className="text-gray-600 text-sm">Receive your tax receipt immediately via email</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Annual Statements</p>
                        <p className="text-gray-600 text-sm">Year-end giving statements sent in January</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Secure Records</p>
                        <p className="text-gray-600 text-sm">All donation records securely stored for 7 years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Important Tax Information</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Apoti Development Association (ADA) is a registered nonprofit organization.
                  Tax ID: {import.meta.env.VITE_TAX_ID} (for US tax purposes)
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>Disclaimer:</strong> This information is provided for general guidance only. 
                  Please consult with your tax advisor for specific advice regarding your situation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Other Ways to Support ADA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Can't donate right now? There are many other ways you can help us make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Volunteer</h3>
              <p className="text-gray-600 mb-4">
                Join our team of volunteers and contribute your time and skills to our mission.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                Learn More →
              </button>
            </motion.div>

            <motion.div 
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Globe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Spread the Word</h3>
              <p className="text-gray-600 mb-4">
                Share our mission with friends and family to help us reach more people in need.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                Share Now →
              </button>
            </motion.div>

            <motion.div 
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Corporate Partnership</h3>
              <p className="text-gray-600 mb-4">
                Partner with us to create meaningful corporate social responsibility programs.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                Contact Us →
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}