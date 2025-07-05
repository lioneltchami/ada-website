import React from 'react';
import TeamMember from '../components/TeamMember';
import { Users, Heart, Award } from 'lucide-react';

export default function Team() {
  const teamMembers = [
    {
      name: "Marie Ngozi",
      role: "Founder & Executive Director",
      image: "https://images.pexels.com/photos/6646971/pexels-photo-6646971.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Marie founded Apoti Development Association (ADA) with a vision to empower vulnerable communities. With over 10 years of experience in community development, she leads our organization with passion and dedication.",
      email: "marie@apotidevelopment.org",
      linkedin: "https://linkedin.com/in/marie-ngozi-ada",
      twitter: "https://twitter.com/marie_ngozi_ada"
    },
    {
      name: "Jean-Paul Mbah",
      role: "Program Director",
      image: "https://images.pexels.com/photos/6646970/pexels-photo-6646970.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Jean-Paul oversees all ADA programs and ensures they meet the highest standards of effectiveness and impact. His background in social work brings valuable expertise to our team.",
      email: "jeanpaul@apotidevelopment.org",
      linkedin: "https://linkedin.com/in/jeanpaul-mbah-ada",
      twitter: "https://twitter.com/jeanpaul_ada"
    },
    {
      name: "Grace Tembon",
      role: "Community Outreach Coordinator",
      image: "https://images.pexels.com/photos/6647005/pexels-photo-6647005.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Grace builds relationships with communities and ensures ADA programs are culturally appropriate and community-led. She is the bridge between our organization and the people we serve.",
      email: "grace@apotidevelopment.org",
      linkedin: "https://linkedin.com/in/grace-tembon-ada",
      twitter: "https://twitter.com/grace_tembon_ada"
    },
    {
      name: "Samuel Nkeng",
      role: "Finance & Operations Manager",
      image: "https://images.pexels.com/photos/6646969/pexels-photo-6646969.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Samuel ensures ADA's financial resources are managed transparently and efficiently. His attention to detail and commitment to accountability keeps our operations running smoothly.",
      email: "samuel@apotidevelopment.org",
      linkedin: "https://linkedin.com/in/samuel-nkeng-ada",
      twitter: "https://twitter.com/samuel_nkeng_ada"
    },
    {
      name: "Fatima Bello",
      role: "Women's Empowerment Specialist",
      image: "https://images.pexels.com/photos/6647004/pexels-photo-6647004.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Fatima leads ADA's women's empowerment initiatives, focusing on skills training and economic opportunities for widows and young women. Her work directly impacts hundreds of women each year.",
      email: "fatima@apotidevelopment.org",
      linkedin: "https://linkedin.com/in/fatima-bello-ada",
      twitter: "https://twitter.com/fatima_bello_ada"
    },
    {
      name: "Emmanuel Tabi",
      role: "Youth Programs Coordinator",
      image: "https://images.pexels.com/photos/6646968/pexels-photo-6646968.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Emmanuel develops and implements ADA programs for orphans and young people, focusing on education and mentorship. His youthful energy and innovative approach inspire the next generation.",
      email: "emmanuel@apotidevelopment.org",
      linkedin: "https://linkedin.com/in/emmanuel-tabi-ada",
      twitter: "https://twitter.com/emmanuel_tabi_ada"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "12",
      label: "Team Members",
      description: "Dedicated professionals working full-time"
    },
    {
      icon: Heart,
      number: "50+",
      label: "Volunteers",
      description: "Community volunteers supporting our mission"
    },
    {
      icon: Award,
      number: "25+",
      label: "Years Combined Experience",
      description: "In community development and social work"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Behind every successful project is a dedicated team of individuals who believe in creating positive change. 
              Meet the passionate people who make the Apoti Development Association (ADA) mission possible.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-lg font-semibold text-primary-600 mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each team member brings unique skills and experiences that contribute to our collective mission 
              of empowering communities across Cameroon through ADA's programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Values & Culture */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Our Team Culture at ADA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Collaboration</h3>
                <p className="text-primary-100">
                  We work together as a unified team, leveraging each other's strengths 
                  to achieve our common goals and maximize our impact across Cameroon.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
                <p className="text-primary-100">
                  We constantly seek new and creative ways to address challenges, 
                  always looking for better solutions to serve our communities through ADA.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Integrity</h3>
                <p className="text-primary-100">
                  We maintain the highest ethical standards in all our work, 
                  ensuring transparency and accountability in everything ADA does.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join the ADA Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're always looking for passionate individuals who want to make a difference through ADA. 
            Whether as a volunteer or team member, there's a place for you in our organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-full font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              Volunteer With ADA
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-primary-500 hover:text-primary-600 transition-all duration-200">
              View Open Positions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}