import React from 'react';
import { Calendar, Target, Eye, Heart } from 'lucide-react';

export default function About() {
  const milestones = [
    {
      year: "2021",
      title: "Foundation Established",
      description: "Apoti Development Association was founded with a vision to support vulnerable communities in Cameroon."
    },
    {
      year: "2022",
      title: "First Major Project",
      description: "Launched our first widow support program, providing resources and training to 30 widows in rural areas."
    },
    {
      year: "2023",
      title: "Expansion of Services",
      description: "Extended our reach to include orphan care and youth empowerment programs across multiple communities."
    },
    {
      year: "2024",
      title: "Community Impact",
      description: "Reached over 500 beneficiaries through various programs and established partnerships with local organizations."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every individual and community with empathy, understanding, and unconditional love."
    },
    {
      icon: Target,
      title: "Empowerment",
      description: "We believe in giving people the tools and opportunities they need to build better lives for themselves."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We maintain complete transparency in our operations, ensuring donors and communities can trust our work."
    },
    {
      icon: Calendar,
      title: "Sustainability",
      description: "We focus on creating long-term solutions that continue to benefit communities for years to come."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Story
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Born from a deep commitment to serve those in need, Apoti Development Association 
              has been transforming lives in Cameroon since 2021.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How We Began
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2021, a group of passionate individuals came together with a shared vision: 
                  to create meaningful change in the lives of Cameroon's most vulnerable populations. 
                  We saw widows struggling to provide for their families, orphans without access to 
                  education, and young girls lacking opportunities for growth.
                </p>
                <p>
                  What started as a small community initiative has grown into a comprehensive 
                  development organization. We realized that true change requires more than just 
                  temporary assistance – it requires empowerment, education, and sustainable solutions 
                  that address the root causes of poverty and inequality.
                </p>
                <p>
                  Today, Apoti Development Association stands as a beacon of hope in our communities, 
                  with programs that not only provide immediate support but also create lasting pathways 
                  to independence and prosperity.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Community gathering in Cameroon"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">500+</div>
                  <div className="text-sm text-gray-600">Lives Transformed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower vulnerable communities in Cameroon through sustainable programs that 
                support widows, orphans, and young girls while promoting community development 
                and social cohesion.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A Cameroon where every person, regardless of their circumstances, has access to 
                opportunities for growth, education, and a dignified life free from poverty and inequality.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact</h3>
              <p className="text-gray-600">
                Since 2021, we have directly impacted over 500 lives through our various programs, 
                creating ripple effects that benefit entire communities and future generations.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide every decision we make and every program we implement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to meaningful impact - here's how we've grown over the years.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-200 to-secondary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}