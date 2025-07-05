import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  id?: string;
  title: string;
  description: string;
  image: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  date: string;
  location: string;
  beneficiaries: number;
}

export default function ProjectCard({
  id,
  title,
  description,
  image,
  status,
  date,
  location,
  beneficiaries
}: ProjectCardProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-yellow-100 text-yellow-800'
  };

  // Generate ID from title if not provided
  const projectId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <Link to={`/projects/${projectId}`} className="block">
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer"
        whileHover={{ 
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <motion.span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]} backdrop-blur-sm`}
              whileHover={{ scale: 1.05 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-full p-3"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ArrowRight className="w-6 h-6 text-primary-600" />
            </motion.div>
          </div>
        </div>
        
        <div className="p-6">
          <motion.h3 
            className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{description}</p>
          
          <div className="space-y-2">
            <motion.div 
              className="flex items-center text-sm text-gray-500"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="w-4 h-4 mr-2 text-primary-500" />
              {date}
            </motion.div>
            <motion.div 
              className="flex items-center text-sm text-gray-500"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-4 h-4 mr-2 text-primary-500" />
              {location}
            </motion.div>
            <motion.div 
              className="flex items-center text-sm text-gray-500"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <Users className="w-4 h-4 mr-2 text-primary-500" />
              {beneficiaries} beneficiaries
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-4 flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}