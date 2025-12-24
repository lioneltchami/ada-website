import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { GalleryImage, ViewMode, ViewType } from './types';

interface GalleryGridProps {
  images: GalleryImage[];
  viewMode: ViewMode;
  currentView: ViewType;
  onImageClick: (image: GalleryImage) => void;
  onClearFilters?: () => void;
}

export default function GalleryGrid({
  images,
  viewMode,
  currentView,
  onImageClick,
  onClearFilters,
}: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">No images found matching your criteria.</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all filters to see all images
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className={
        viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
      }
      layout
    >
      <AnimatePresence>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className={`group cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
            onClick={() => onImageClick(image)}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                  viewMode === 'grid' ? 'h-64' : 'h-auto'
                }`}
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2 mb-2">{image.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {image.project}
                    </span>
                    <span>{image.date}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  image.status === 'completed' ? 'bg-green-100 text-green-800' :
                  image.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
                </span>
              </div>

              {/* Sub-images Indicator */}
              {(image.subImages || image.isMainImage) && currentView === 'main' && (
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                    <FolderOpen className="w-3 h-3 text-primary-600" />
                    <span className="text-xs font-medium text-primary-600">
                      {image.subImages?.length || 0}+ photos
                    </span>
                  </div>
                </div>
              )}

              {/* Zoom Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                  {(image.subImages || image.isMainImage) && currentView === 'main' ? (
                    <FolderOpen className="w-6 h-6 text-primary-600" />
                  ) : (
                    <ZoomIn className="w-6 h-6 text-primary-600" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
