import React from 'react';
import { motion } from 'framer-motion';
import Gallery from '../components/Gallery';
import { Camera, Cloud, Database, Settings } from 'lucide-react';

export default function GalleryPage() {
  // Enhanced gallery images with hierarchical structure
  const galleryImages = [
    // Main project images with sub-galleries
    {
      id: 'widow-support-main',
      src: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Widow support program overview',
      title: 'Widow Support Program',
      description: 'Comprehensive support program providing resources, training, and emotional support to widows in rural communities.',
      project: 'Widow Support Program',
      date: 'March 2024',
      location: 'Bamenda, Cameroon',
      year: 2024,
      category: 'widows' as const,
      projectType: 'training' as const,
      projectFocus: 'women' as const,
      status: 'ongoing' as const,
      tags: ['skills training', 'empowerment', 'vocational', 'self-sufficiency'],
      isMainImage: true,
      subImages: [
        {
          id: 'widow-1',
          src: 'https://images.pexels.com/photos/6647005/pexels-photo-6647005.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Widow learning tailoring skills',
          title: 'Tailoring Skills Training',
          description: 'Widows learning essential tailoring skills to start their own businesses.',
          project: 'Widow Support Program',
          date: 'March 2024',
          location: 'Bamenda, Cameroon',
          year: 2024,
          category: 'widows' as const,
          projectType: 'training' as const,
          projectFocus: 'women' as const,
          status: 'ongoing' as const,
          tags: ['tailoring', 'skills', 'business training'],
          parentId: 'widow-support-main'
        },
        {
          id: 'widow-2',
          src: 'https://images.pexels.com/photos/6646971/pexels-photo-6646971.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Widow with her new business',
          title: 'Success Story - New Business',
          description: 'A widow proudly showing her new tailoring business after completing ADA training.',
          project: 'Widow Support Program',
          date: 'April 2024',
          location: 'Bamenda, Cameroon',
          year: 2024,
          category: 'widows' as const,
          projectType: 'support' as const,
          projectFocus: 'women' as const,
          status: 'completed' as const,
          tags: ['success story', 'business', 'independence'],
          parentId: 'widow-support-main'
        },
        {
          id: 'widow-3',
          src: 'https://images.pexels.com/photos/6647004/pexels-photo-6647004.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Group counseling session',
          title: 'Support Group Meeting',
          description: 'Widows participating in group counseling and emotional support sessions.',
          project: 'Widow Support Program',
          date: 'March 2024',
          location: 'Bamenda, Cameroon',
          year: 2024,
          category: 'widows' as const,
          projectType: 'support' as const,
          projectFocus: 'women' as const,
          status: 'ongoing' as const,
          tags: ['counseling', 'support group', 'emotional support'],
          parentId: 'widow-support-main'
        }
      ]
    },
    {
      id: 'education-main',
      src: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Education for orphans program',
      title: 'Education for Orphans',
      description: 'Sponsoring school fees, uniforms, and educational materials for orphaned children.',
      project: 'Education for Orphans',
      date: 'January 2024',
      location: 'Douala, Cameroon',
      year: 2024,
      category: 'orphans' as const,
      projectType: 'education' as const,
      projectFocus: 'children' as const,
      status: 'completed' as const,
      tags: ['education', 'school fees', 'orphans', 'academic support'],
      isMainImage: true,
      subImages: [
        {
          id: 'education-1',
          src: 'https://images.pexels.com/photos/6646970/pexels-photo-6646970.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Children in classroom',
          title: 'Classroom Learning',
          description: 'Orphaned children actively participating in classroom activities.',
          project: 'Education for Orphans',
          date: 'February 2024',
          location: 'Douala, Cameroon',
          year: 2024,
          category: 'orphans' as const,
          projectType: 'education' as const,
          projectFocus: 'children' as const,
          status: 'ongoing' as const,
          tags: ['classroom', 'learning', 'participation'],
          parentId: 'education-main'
        },
        {
          id: 'education-2',
          src: 'https://images.pexels.com/photos/6646969/pexels-photo-6646969.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'School supplies distribution',
          title: 'School Supplies Distribution',
          description: 'Distribution of books, uniforms, and educational materials to sponsored children.',
          project: 'Education for Orphans',
          date: 'January 2024',
          location: 'Douala, Cameroon',
          year: 2024,
          category: 'orphans' as const,
          projectType: 'support' as const,
          projectFocus: 'children' as const,
          status: 'completed' as const,
          tags: ['school supplies', 'uniforms', 'books'],
          parentId: 'education-main'
        }
      ]
    },
    {
      id: 'youth-empowerment-main',
      src: 'https://images.pexels.com/photos/5212662/pexels-photo-5212662.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Young women empowerment program',
      title: 'Young Women Empowerment',
      description: 'Skills training and mentorship program for young girls aged 16-25.',
      project: 'Young Women Empowerment',
      date: 'February 2024',
      location: 'Yaounde, Cameroon',
      year: 2024,
      category: 'youth' as const,
      projectType: 'training' as const,
      projectFocus: 'youth' as const,
      status: 'upcoming' as const,
      tags: ['leadership', 'entrepreneurship', 'young women', 'future leaders'],
      isMainImage: true,
      subImages: [
        {
          id: 'youth-1',
          src: 'https://images.pexels.com/photos/6647004/pexels-photo-6647004.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Leadership workshop',
          title: 'Leadership Workshop',
          description: 'Young women participating in leadership development workshops.',
          project: 'Young Women Empowerment',
          date: 'March 2024',
          location: 'Yaounde, Cameroon',
          year: 2024,
          category: 'youth' as const,
          projectType: 'training' as const,
          projectFocus: 'youth' as const,
          status: 'upcoming' as const,
          tags: ['leadership', 'workshop', 'development'],
          parentId: 'youth-empowerment-main'
        }
      ]
    },
    {
      id: 'community-cleanup-main',
      src: 'https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Community clean-up initiative',
      title: 'Community Clean-up Initiative',
      description: 'Monthly community clean-up drives involving local volunteers.',
      project: 'Community Clean-up Initiative',
      date: 'March 2024',
      location: 'Multiple locations',
      year: 2024,
      category: 'community' as const,
      projectType: 'infrastructure' as const,
      projectFocus: 'environment' as const,
      status: 'ongoing' as const,
      tags: ['environment', 'volunteers', 'clean-up', 'community service'],
      isMainImage: true,
      subImages: [
        {
          id: 'cleanup-1',
          src: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Volunteers cleaning streets',
          title: 'Street Cleaning Day',
          description: 'Volunteers working together to clean neighborhood streets.',
          project: 'Community Clean-up Initiative',
          date: 'March 2024',
          location: 'Bamenda, Cameroon',
          year: 2024,
          category: 'community' as const,
          projectType: 'infrastructure' as const,
          projectFocus: 'environment' as const,
          status: 'ongoing' as const,
          tags: ['street cleaning', 'volunteers', 'teamwork'],
          parentId: 'community-cleanup-main'
        },
        {
          id: 'cleanup-2',
          src: 'https://images.pexels.com/photos/6646968/pexels-photo-6646968.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Tree planting activity',
          title: 'Tree Planting Initiative',
          description: 'Community members planting trees as part of environmental restoration.',
          project: 'Community Clean-up Initiative',
          date: 'April 2024',
          location: 'Douala, Cameroon',
          year: 2024,
          category: 'community' as const,
          projectType: 'infrastructure' as const,
          projectFocus: 'environment' as const,
          status: 'ongoing' as const,
          tags: ['tree planting', 'environment', 'restoration'],
          parentId: 'community-cleanup-main'
        }
      ]
    },
    // Standalone images
    {
      id: 'healthcare-1',
      src: 'https://images.pexels.com/photos/6646921/pexels-photo-6646921.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Mobile health clinic',
      title: 'Mobile Health Clinic',
      description: 'Healthcare professionals providing essential medical services to rural communities.',
      project: 'Healthcare Access Program',
      date: 'December 2023',
      location: 'Rural Cameroon',
      year: 2023,
      category: 'healthcare' as const,
      projectType: 'healthcare' as const,
      projectFocus: 'health' as const,
      status: 'completed' as const,
      tags: ['mobile clinic', 'rural health', 'medical services', 'healthcare access']
    },
    {
      id: 'agriculture-1',
      src: 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Agricultural training session',
      title: 'Sustainable Farming',
      description: 'Teaching modern agricultural techniques to help families achieve food security.',
      project: 'Agricultural Training Program',
      date: 'April 2024',
      location: 'Northwest Region',
      year: 2024,
      category: 'agriculture' as const,
      projectType: 'training' as const,
      projectFocus: 'community' as const,
      status: 'upcoming' as const,
      tags: ['agriculture', 'food security', 'farming techniques', 'sustainability']
    }
  ];

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
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ADA Project Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore the real impact of ADA's work through our comprehensive photo collections. 
              Click on project folders to see detailed photo galleries, or browse individual images from all our initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Management Instructions */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Cloud className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Advanced Gallery Management System
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our hierarchical gallery system supports thousands of photos with advanced filtering, 
                external hosting, and lightning-fast performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Cloud className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Hierarchical Structure</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Organize photos in project folders with sub-galleries:
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Main project images with sub-collections</li>
                  <li>• Standalone images for quick access</li>
                  <li>• Unlimited nesting levels supported</li>
                  <li>• Smart navigation between levels</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-5 h-5 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Advanced Filtering</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Multi-dimensional filtering system:
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Year, category, project type filters</li>
                  <li>• Status and focus area filtering</li>
                  <li>• Full-text search across all metadata</li>
                  <li>• Tag-based organization</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Performance Features</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Optimized for speed and scalability:
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Lazy loading and image optimization</li>
                  <li>• CDN integration for global delivery</li>
                  <li>• Smart caching and preloading</li>
                  <li>• Mobile-optimized responsive design</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Gallery Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Hierarchical folder structure with sub-galleries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Advanced lightbox with sharing and download</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Grid and masonry view modes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time filtering and search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>External hosting ready (S3, Cloudinary, etc.)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mobile-first responsive design</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Component */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Gallery images={galleryImages} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of ADA's Story
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Every image in our gallery represents lives transformed and communities empowered through ADA. 
              Your support helps us create more stories of hope and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/donate'}
              >
                Support ADA Projects
              </motion.button>
              <motion.button 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
              >
                Get Involved with ADA
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}