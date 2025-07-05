import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Heart, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Location {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  projects: number;
  beneficiaries: number;
  description: string;
  recentProject: string;
  date: string;
  projectId?: string; // Link to project detail page
}

export default function ImpactMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    {
      id: '1',
      name: 'Bamenda',
      coordinates: { x: 25, y: 30 },
      projects: 8,
      beneficiaries: 180,
      description: 'Our largest operation center focusing on widow support and community development in the Northwest Region.',
      recentProject: 'Widow Support Program',
      date: 'March 2024',
      projectId: 'widow-support-program'
    },
    {
      id: '2',
      name: 'Douala',
      coordinates: { x: 35, y: 75 },
      projects: 6,
      beneficiaries: 150,
      description: 'Major port city where we focus on education for orphans and youth programs in the Littoral Region.',
      recentProject: 'Education for Orphans',
      date: 'January 2024',
      projectId: 'education-for-orphans'
    },
    {
      id: '3',
      name: 'Yaounde',
      coordinates: { x: 45, y: 55 },
      projects: 5,
      beneficiaries: 120,
      description: 'Capital city operations focusing on young women empowerment and skills training in the Centre Region.',
      recentProject: 'Young Women Empowerment',
      date: 'February 2024',
      projectId: 'young-women-empowerment'
    },
    {
      id: '4',
      name: 'SW Region - Buea',
      coordinates: { x: 20, y: 80 },
      projects: 7,
      beneficiaries: 140,
      description: 'Southwest Region operations including Molyko, Mile 18, MUEA, and Bokwaongo communities with healthcare and agricultural programs.',
      recentProject: 'Healthcare Access Program',
      date: 'December 2023',
      projectId: 'healthcare-access'
    },
    {
      id: '5',
      name: 'Maroua',
      coordinates: { x: 55, y: 15 },
      projects: 4,
      beneficiaries: 95,
      description: 'Far North Region where we implement agricultural training and community development programs.',
      recentProject: 'Agricultural Training Program',
      date: 'April 2024',
      projectId: 'agricultural-training'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Our Impact Across Cameroon
        </h3>
        <p className="text-gray-600">
          Click on the markers to see our work in different regions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Cameroon Map */}
        <div className="relative">
          <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-xl overflow-hidden">
            {/* More accurate Cameroon outline */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Cameroon country outline - more detailed shape */}
              <path
                d="M15 15 L25 12 L35 15 L45 18 L55 15 L65 20 L70 25 L75 35 L80 45 L85 55 L80 65 L75 75 L70 85 L60 88 L50 85 L40 88 L30 85 L20 80 L15 70 L10 60 L12 50 L10 40 L12 30 L15 20 Z"
                fill="rgba(34, 197, 94, 0.3)"
                stroke="rgba(34, 197, 94, 0.6)"
                strokeWidth="0.5"
              />
              
              {/* Regional boundaries */}
              <path
                d="M15 15 L35 15 L45 25 L35 35 L25 30 Z"
                fill="rgba(34, 197, 94, 0.1)"
                stroke="rgba(34, 197, 94, 0.4)"
                strokeWidth="0.3"
              />
              
              {/* Add some geographical features */}
              <circle cx="45" cy="55" r="2" fill="rgba(59, 130, 246, 0.5)" />
              <text x="47" y="58" fontSize="3" fill="rgba(59, 130, 246, 0.8)">Yaoundé</text>
              
              <circle cx="35" cy="75" r="2" fill="rgba(59, 130, 246, 0.5)" />
              <text x="37" y="78" fontSize="3" fill="rgba(59, 130, 246, 0.8)">Douala</text>
            </svg>

            {/* Location markers */}
            {locations.map((location) => (
              <motion.button
                key={location.id}
                className="absolute w-6 h-6 bg-primary-500 rounded-full border-4 border-white shadow-lg hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedLocation(location)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * parseInt(location.id) }}
              >
                <MapPin className="w-3 h-3 text-white" />
              </motion.button>
            ))}

            {/* Pulse animation for active marker */}
            {selectedLocation && (
              <motion.div
                className="absolute w-12 h-12 border-2 border-primary-400 rounded-full"
                style={{
                  left: `${selectedLocation.coordinates.x}%`,
                  top: `${selectedLocation.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          {selectedLocation ? (
            <motion.div
              key={selectedLocation.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6"
            >
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedLocation.name}
              </h4>
              <p className="text-gray-600 mb-6">
                {selectedLocation.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedLocation.projects}
                  </div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedLocation.beneficiaries}
                  </div>
                  <div className="text-sm text-gray-600">Beneficiaries</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    Recent Project: {selectedLocation.recentProject}
                  </div>
                  {selectedLocation.projectId && (
                    <Link
                      to={`/projects/${selectedLocation.projectId}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedLocation.date}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                Select a Location
              </h4>
              <p className="text-gray-500">
                Click on any marker on the map to see details about our work in that region.
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h5 className="font-semibold text-gray-900 mb-4">Total Impact Across Cameroon</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-primary-600">
                  {locations.reduce((sum, loc) => sum + loc.projects, 0)}
                </div>
                <div className="text-xs text-gray-600">Total Projects</div>
              </div>
              <div>
                <div className="text-xl font-bold text-secondary-600">
                  {locations.reduce((sum, loc) => sum + loc.beneficiaries, 0)}
                </div>
                <div className="text-xs text-gray-600">Total Beneficiaries</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent-600">
                  {locations.length}
                </div>
                <div className="text-xs text-gray-600">Active Regions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}