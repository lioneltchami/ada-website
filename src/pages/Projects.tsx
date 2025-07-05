import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Filter } from 'lucide-react';

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 'widow-support-program',
      title: "Widow Support Program",
      description: "Comprehensive support program providing resources, training, and emotional support to widows in rural communities. Includes skills training, small business loans, and counseling services.",
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "ongoing" as const,
      date: "March 2024",
      location: "Bamenda, Cameroon",
      beneficiaries: 45
    },
    {
      id: 'education-for-orphans',
      title: "Education for Orphans",
      description: "Sponsoring school fees, uniforms, and educational materials for orphaned children. Also providing after-school tutoring and mentorship programs.",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "completed" as const,
      date: "January 2024",
      location: "Douala, Cameroon",
      beneficiaries: 120
    },
    {
      id: 'young-women-empowerment',
      title: "Young Women Empowerment",
      description: "Skills training and mentorship program for young girls aged 16-25, focusing on vocational skills, entrepreneurship, and leadership development.",
      image: "https://images.pexels.com/photos/5212662/pexels-photo-5212662.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "upcoming" as const,
      date: "May 2024",
      location: "Yaounde, Cameroon",
      beneficiaries: 80
    },
    {
      id: 'community-cleanup',
      title: "Community Clean-up Initiative",
      description: "Monthly community clean-up drives involving local volunteers to maintain clean and healthy neighborhoods while promoting environmental awareness.",
      image: "https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "ongoing" as const,
      date: "Ongoing",
      location: "Multiple locations",
      beneficiaries: 200
    },
    {
      id: 'healthcare-access',
      title: "Healthcare Access Program",
      description: "Mobile health clinics providing basic healthcare services, health education, and preventive care to underserved rural communities.",
      image: "https://images.pexels.com/photos/6646921/pexels-photo-6646921.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "completed" as const,
      date: "December 2023",
      location: "Rural Cameroon",
      beneficiaries: 300
    },
    {
      id: 'agricultural-training',
      title: "Agricultural Training Program",
      description: "Teaching sustainable farming techniques and providing seeds and tools to help families achieve food security and generate income.",
      image: "https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=800",
      status: "upcoming" as const,
      date: "June 2024",
      location: "Northwest Region",
      beneficiaries: 150
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  const statusCounts = {
    all: projects.length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length,
    upcoming: projects.filter(p => p.status === 'upcoming').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the initiatives that are creating lasting change in communities across Cameroon through ADA. 
              From supporting widows to educating orphans, each project represents our commitment to building a better future.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Filter Projects:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ADA's Collective Impact
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Every project contributes to our mission of empowering communities and creating sustainable change through ADA.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">895</div>
              <div className="text-primary-100">Total Beneficiaries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">6</div>
              <div className="text-primary-100">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-primary-100">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">3</div>
              <div className="text-primary-100">Years of Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Help ADA Expand Our Impact
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your support enables ADA to launch new projects and expand existing ones. 
            Together, we can reach more communities and transform more lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-full font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              Support ADA Projects
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-primary-500 hover:text-primary-600 transition-all duration-200">
              Volunteer With ADA
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}