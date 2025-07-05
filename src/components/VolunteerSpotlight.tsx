import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Award, Clock, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  joinDate: string;
  hoursContributed: number;
  projectsInvolved: string[];
  achievements: string[];
  quote: string;
  skills: string[];
  impact: string;
}

interface VolunteerSpotlightProps {
  volunteers: Volunteer[];
  autoRotate?: boolean;
  interval?: number;
}

export default function VolunteerSpotlight({ 
  volunteers, 
  autoRotate = true, 
  interval = 6000 
}: VolunteerSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (autoRotate && volunteers.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % volunteers.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoRotate, interval, volunteers.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % volunteers.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + volunteers.length) % volunteers.length);
  };

  if (volunteers.length === 0) return null;

  const currentVolunteer = volunteers[currentIndex];

  return (
    <div className="bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-secondary-500 mr-3" />
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Volunteer Spotlight
          </h3>
        </div>
        <p className="text-gray-600">
          Celebrating the amazing volunteers who make ADA's mission possible.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVolunteer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
              {/* Profile Section */}
              <div className="text-center">
                <img
                  src={currentVolunteer.image}
                  alt={currentVolunteer.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                />
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {currentVolunteer.name}
                </h4>
                <p className="text-secondary-600 font-medium mb-2">
                  {currentVolunteer.role}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {currentVolunteer.location}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-secondary-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {currentVolunteer.hoursContributed}
                    </div>
                    <div className="text-xs text-gray-600">Hours</div>
                  </div>
                  <div className="bg-accent-50 p-3 rounded-lg">
                    <Award className="w-5 h-5 text-accent-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {currentVolunteer.projectsInvolved.length}
                    </div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="md:col-span-2 space-y-6">
                {/* Quote */}
                <blockquote className="bg-gray-50 p-4 rounded-lg border-l-4 border-secondary-400">
                  <p className="text-gray-700 italic mb-2">"{currentVolunteer.quote}"</p>
                  <cite className="text-sm text-gray-600">- {currentVolunteer.name}</cite>
                </blockquote>

                {/* Impact */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Impact Story
                  </h5>
                  <p className="text-gray-600 text-sm">{currentVolunteer.impact}</p>
                </div>

                {/* Projects Involved */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Projects Involved</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentVolunteer.projectsInvolved.map((project, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Skills & Expertise</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentVolunteer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent-100 text-accent-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {currentVolunteer.achievements.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      Achievements
                    </h5>
                    <ul className="space-y-1">
                      {currentVolunteer.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Join Date */}
                <div className="text-sm text-gray-500">
                  Volunteer since {currentVolunteer.joinDate}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {volunteers.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {volunteers.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {volunteers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? 'bg-secondary-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          Want to make a difference like {currentVolunteer.name}?
        </p>
        <button className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-secondary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          Become a Volunteer
        </button>
      </div>
    </div>
  );
}