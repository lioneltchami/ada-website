import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface ImpactStory {
  id: string;
  name: string;
  age: number;
  location: string;
  program: string;
  beforeStory: string;
  afterStory: string;
  quote: string;
  image: string;
  videoUrl?: string;
  metrics: {
    label: string;
    before: string;
    after: string;
  }[];
  tags: string[];
}

interface ImpactStoriesProps {
  stories: ImpactStory[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImpactStories({ 
  stories, 
  autoPlay = true, 
  interval = 8000 
}: ImpactStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showVideo, setShowVideo] = useState(false);

  React.useEffect(() => {
    if (isPlaying && stories.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, interval, stories.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-primary-500 mr-3" />
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Stories of Transformation
          </h3>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real stories from real people whose lives have been transformed through ADA's programs.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image/Video Section */}
              <div className="relative h-64 lg:h-auto">
                {showVideo && currentStory.videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      src={currentStory.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={currentStory.image}
                    />
                    <button
                      onClick={() => setShowVideo(false)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={currentStory.image}
                      alt={currentStory.name}
                      className="w-full h-full object-cover"
                    />
                    {currentStory.videoUrl && (
                      <button
                        onClick={() => setShowVideo(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-200"
                      >
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="w-8 h-8 text-primary-600" />
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{currentStory.name}</h4>
                      <p className="text-gray-600">Age {currentStory.age} • {currentStory.location}</p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentStory.program}
                    </span>
                  </div>

                  {/* Before/After Story */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                      <h5 className="font-semibold text-red-800 mb-2">Before ADA</h5>
                      <p className="text-red-700 text-sm">{currentStory.beforeStory}</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <h5 className="font-semibold text-green-800 mb-2">After ADA</h5>
                      <p className="text-green-700 text-sm">{currentStory.afterStory}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="relative bg-gray-50 p-4 rounded-lg mb-6">
                    <Quote className="absolute top-2 left-2 w-6 h-6 text-primary-400" />
                    <p className="text-gray-700 italic pl-8">"{currentStory.quote}"</p>
                  </blockquote>

                  {/* Metrics */}
                  {currentStory.metrics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentStory.metrics.map((metric, index) => (
                        <div key={index} className="text-center bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-red-600 font-medium">{metric.before}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-green-600 font-bold">{metric.after}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {stories.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      {stories.length > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-gray-600" /> : <Play className="w-5 h-5 text-gray-600" />}
          </button>

          {/* Dots */}
          <div className="flex space-x-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex
                    ? 'bg-primary-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}