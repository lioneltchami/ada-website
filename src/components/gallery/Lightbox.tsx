import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Download, Share2 } from 'lucide-react';
import { GalleryImage } from './types';

interface LightboxProps {
  image: GalleryImage;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onShare: (image: GalleryImage) => void;
  onDownload: (image: GalleryImage) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export default function Lightbox({
  image,
  currentIndex,
  totalImages,
  onClose,
  onNavigate,
  onShare,
  onDownload,
  onKeyDown,
}: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-6xl max-h-full bg-white rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header with Actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <button
            onClick={() => onShare(image)}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            title="Share Image"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDownload(image)}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            title="Download Image"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Buttons */}
        {totalImages > 1 && (
          <>
            <button
              onClick={() => onNavigate('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh]">
          {/* Image */}
          <div className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-96 lg:h-full object-cover"
            />
          </div>

          {/* Enhanced Details */}
          <div className="p-8 overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {image.project}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  image.status === 'completed' ? 'bg-green-100 text-green-800' :
                  image.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{image.title}</h3>
              <p className="text-gray-600 leading-relaxed">{image.description}</p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-primary-500" />
                <span>{image.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-primary-500" />
                <span>{image.location}</span>
              </div>
            </div>

            {/* Tags */}
            {image.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => onShare(image)}
                className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={() => onDownload(image)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>

            {totalImages > 1 && (
              <div className="mt-6 text-center text-sm text-gray-500">
                {currentIndex + 1} of {totalImages}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
