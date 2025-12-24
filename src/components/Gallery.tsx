import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { GalleryImage, GalleryFilters as GalleryFiltersType, ViewMode, ViewType } from './gallery/types';
import GalleryControls from './gallery/GalleryControls';
import GalleryGrid from './gallery/GalleryGrid';
import Lightbox from './gallery/Lightbox';

interface GalleryProps {
  images: GalleryImage[];
  title?: string;
  showFilters?: boolean;
  viewMode?: ViewMode;
}

export default function Gallery({
  images,
  title = "Project Gallery",
  viewMode = 'grid'
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedMainImage, setSelectedMainImage] = useState<GalleryImage | null>(null);
  const [filters, setFilters] = useState<GalleryFiltersType>({
    year: 'all',
    category: 'all',
    projectType: 'all',
    projectFocus: 'all',
    status: 'all',
    search: ''
  });
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(viewMode);
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
  }, [filters, currentView, selectedMainImage, mainImages, standaloneImages]);

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
      toast.success('Link copied to clipboard!', {
        icon: '📋',
        duration: 3000,
      });
    }
  };

  const downloadImage = async (image: GalleryImage) => {
    try {
      // Fetch the image as a blob to handle CORS
      const response = await fetch(image.src, {
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

      toast.success('Image downloaded successfully!', {
        icon: '⬇️',
        duration: 3000,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image. Please try opening it in a new tab and saving manually.', {
        duration: 5000,
      });
    }
  };

  const handleImageClick = (image: GalleryImage) => {
    if (currentView === 'main' && (image.subImages || image.isMainImage)) {
      openSubGallery(image);
    } else {
      openLightbox(image);
    }
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

      {/* Controls */}
      <GalleryControls
        searchValue={filters.search}
        onSearchChange={(value) => updateFilter('search', value)}
        viewMode={currentViewMode}
        onViewModeChange={setCurrentViewMode}
        filters={filters}
        filterOptions={filterOptions}
        isFilterOpen={isFilterOpen}
        activeFilterCount={activeFilterCount}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        onUpdateFilter={updateFilter}
        onClearFilters={clearAllFilters}
      />

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
      <GalleryGrid
        images={filteredImages}
        viewMode={currentViewMode}
        currentView={currentView}
        onImageClick={handleImageClick}
        onClearFilters={filteredImages.length === 0 ? clearAllFilters : undefined}
      />

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            currentIndex={currentIndex}
            totalImages={filteredImages.length}
            onClose={closeLightbox}
            onNavigate={navigateImage}
            onShare={shareImage}
            onDownload={downloadImage}
            onKeyDown={handleKeyDown}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
