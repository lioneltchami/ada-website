import React from 'react';
import { Search, Grid, List } from 'lucide-react';
import { ViewMode } from './types';
import GalleryFilters from './GalleryFilters';
import { GalleryFilters as Filters, FilterOptions } from './types';

interface GalleryControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: Filters;
  filterOptions: FilterOptions;
  isFilterOpen: boolean;
  activeFilterCount: number;
  onFilterToggle: () => void;
  onUpdateFilter: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export default function GalleryControls({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  filters,
  filterOptions,
  isFilterOpen,
  activeFilterCount,
  onFilterToggle,
  onUpdateFilter,
  onClearFilters,
}: GalleryControlsProps) {
  return (
    <>
      {/* Search and View Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
        </div>

        {/* View Mode and Filter Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('masonry')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'masonry' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              aria-label="Masonry view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <GalleryFilters
            filters={filters}
            filterOptions={filterOptions}
            isOpen={isFilterOpen}
            activeFilterCount={activeFilterCount}
            onToggle={onFilterToggle}
            onUpdateFilter={onUpdateFilter}
            onClearAll={onClearFilters}
          />
        </div>
      </div>
    </>
  );
}
