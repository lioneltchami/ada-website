import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Filter, Search, Grid, List, FolderOpen, Image as ImageIcon, ZoomIn, Download, Share2, Heart } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  project: string;
  date: string;
  location: string;
  year: number;
  category: 'widows' | 'orphans' | 'youth' | 'community' | 'healthcare' | 'education' | 'agriculture';
  projectType: 'support' | 'training' | 'infrastructure' | 'healthcare' | 'education';
  projectFocus: 'women' | 'children' | 'youth' | 'community' | 'environment' | 'health';
  status: 'completed' | 'ongoing' | 'upcoming';
  tags: string[];
  subImages?: GalleryImage[];
  isMainImage?: boolean;
  parentId?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  title?: string;
  showFilters?: boolean;
  viewMode?: 'grid' | 'masonry';
}

export default function Gallery({ 
  images, 
  title = "Project Gallery", 
  showFilters = true,
  viewMode = 'grid'
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'main' | 'sub'>('main');
  const [selectedMainImage, setSelectedMainImage] = useState<GalleryImage | null>(null);
  const [filters, setFilters] = useState({
    year: 'all',
    category: 'all',
    projectType: 'all',
    projectFocus: 'all',
    status: 'all',
    search: ''
  });
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'masonry'>(viewMode);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Separate main images (with sub-images) from standalone images
  const mainImages = useMemo(() => {
    return images.filter(img => img.isMainImage || img.subImages);
  }, [images]);

  const standaloneImages = useMemo(() => {
    return images.filter(img => !img.isMainImage && !img.subImages && !img.parentId);
  }, [images]);

  // Extract unique filter options from all images
  const filterOptions = useMemo(() => {
    const allImages = [...images];
    images.forEach(img => {
      if (img.subImages) {
        allImages.push(...img.subImages);
      }
    });

    const years = [...new Set(allImages.map(img => img.year))].sort((a, b) => b - a);
    const categories = [...new Set(allImages.map(img => img.category))];
    const projectTypes = [...new Set(allImages.map(img => img.projectType))];
    const projectFocuses = [...new Set(allImages.map(img => img.projectFocus))];
    const statuses = [...new Set(allImages.map(img => img.status))];

    return { years, categories, projectTypes, projectFocuses, statuses };
  }, [images]);

  // Filter images based on current filters and view
  const filteredImages = useMemo(() => {
    const imagesToFilter = currentView === 'main' 
      ? [...mainImages, ...standaloneImages]
      : selectedMainImage?.subImages || [];

    return imagesToFilter.filter(image => {
      const matchesYear = filters.year === 'all' || image.year.toString() === filters.year;
      const matchesCategory = filters.category === 'all' || image.category === filters.category;
      const matchesProjectType = filters.projectType === 'all' || image.projectType === filters.projectType;
      const matchesProjectFocus = filters.projectFocus === 'all' || image.projectFocus === filters.projectFocus;
      const matchesStatus = filters.status === 'all' || image.status === filters.status;
      const matchesSearch = filters.search === '' || 
        image.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        image.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        image.project.toLowerCase().includes(filters.search.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

      return matchesYear && matchesCategory && matchesProjectType && 
             matchesProjectFocus && matchesStatus && matchesSearch;
    });
  }, [images, filters, currentView, selectedMainImage, mainImages, standaloneImages]);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setCurrentIndex(filteredImages.findIndex(img => img.id === image.id));
  };

  const openSubGallery = (mainImage: GalleryImage) => {
    if (mainImage.subImages && mainImage.subImages.length > 0) {
      setSelectedMainImage(mainImage);
      setCurrentView('sub');
    } else {
      openLightbox(mainImage);
    }
  };

  const backToMain = () => {
    setCurrentView('main');
    setSelectedMainImage(null);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentIndex + 1) % filteredImages.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      year: 'all',
      category: 'all',
      projectType: 'all',
      projectFocus: 'all',
      status: 'all',
      search: ''
    });
  };

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const downloadImage = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== 'all' && value !== '').length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {currentView === 'sub' && (
            <button
              onClick={backToMain}
              className="mr-4 flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Main Gallery
            </button>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {currentView === 'sub' && selectedMainImage 
              ? `${selectedMainImage.title} - Photo Collection`
              : title
            }
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {currentView === 'sub' && selectedMainImage
            ? `Explore all photos from the ${selectedMainImage.project} project`
            : "Witness the impact of ADA's work through these powerful images from our various projects across Cameroon."
          }
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search images..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
        </div>

        {/* View Mode and Filter Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                currentViewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentViewMode('masonry')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                currentViewMode === 'masonry' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-primary-600 text-xs px-2 py-1 rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => updateFilter('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Years</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select
                    value={filters.projectType}
                    onChange={(e) => updateFilter('projectType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Types</option>
                    {filterOptions.projectTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Focus Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
                  <select
                    value={filters.projectFocus}
                    onChange={(e) => updateFilter('projectFocus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Focus Areas</option>
                    {filterOptions.projectFocuses.map(focus => (
                      <option key={focus} value={focus}>
                        {focus.charAt(0).toUpperCase() + focus.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Statuses</option>
                    {filterOptions.statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="mb-6 text-gray-600">
        Showing {filteredImages.length} of {currentView === 'main' ? images.length : selectedMainImage?.subImages?.length || 0} images
        {activeFilterCount > 0 && (
          <span className="ml-2 text-primary-600">
            ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied)
          </span>
        )}
      </div>

      {/* Gallery Grid */}
      <motion.div 
        className={
          currentViewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        }
        layout
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className={`group cursor-pointer ${currentViewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
              onClick={() => {
                if (currentView === 'main' && (image.subImages || image.isMainImage)) {
                  openSubGallery(image);
                } else {
                  openLightbox(image);
                }
              }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                    currentViewMode === 'grid' ? 'h-64' : 'h-auto'
                  }`}
                  loading="lazy"
                />
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

                {/* Sub-images indicator */}
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

                {/* Zoom indicator */}
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

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No images found matching your criteria.</p>
          <button
            onClick={clearAllFilters}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all filters to see all images
          </button>
        </div>
      )}

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
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
                  onClick={() => shareImage(selectedImage)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  title="Share Image"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => downloadImage(selectedImage)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  title="Download Image"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
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
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-96 lg:h-full object-cover"
                  />
                </div>

                {/* Enhanced Details */}
                <div className="p-8 overflow-y-auto">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedImage.project}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedImage.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedImage.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedImage.status.charAt(0).toUpperCase() + selectedImage.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedImage.description}</p>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedImage.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedImage.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedImage.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag, index) => (
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
                      onClick={() => shareImage(selectedImage)}
                      className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => downloadImage(selectedImage)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>

                  {filteredImages.length > 1 && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                      {currentIndex + 1} of {filteredImages.length}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}