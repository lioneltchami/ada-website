import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import GalleryFilters from './GalleryFilters';
import { GalleryFilters as GalleryFiltersType, FilterOptions } from './types';

describe('GalleryFilters', () => {
  const mockFilters: GalleryFiltersType = {
    year: 'all',
    category: 'all',
    projectType: 'all',
    projectFocus: 'all',
    status: 'all',
    search: '',
  };

  const mockFilterOptions: FilterOptions = {
    years: [2024, 2023, 2022],
    categories: ['widows', 'orphans', 'youth'],
    projectTypes: ['support', 'training'],
    projectFocuses: ['women', 'children'],
    statuses: ['completed', 'ongoing'],
  };

  const mockOnToggle = vi.fn();
  const mockOnUpdateFilter = vi.fn();
  const mockOnClearAll = vi.fn();

  it('should render filter button with correct count', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={false}
        activeFilterCount={0}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should display active filter count badge', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={false}
        activeFilterCount={3}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should call onToggle when filter button is clicked', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={false}
        activeFilterCount={0}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    fireEvent.click(screen.getByText('Filters'));
    expect(mockOnToggle).toHaveBeenCalled();
  });

  it('should render filter panel when open', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={true}
        activeFilterCount={0}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Project Type')).toBeInTheDocument();
    expect(screen.getByText('Focus Area')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should call onUpdateFilter when filter value changes', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={true}
        activeFilterCount={0}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    const yearSelects = screen.getAllByDisplayValue('All Years');
    fireEvent.change(yearSelects[0], { target: { value: '2024' } });

    expect(mockOnUpdateFilter).toHaveBeenCalledWith('year', '2024');
  });

  it('should render clear all button when filters are active', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={true}
        activeFilterCount={2}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    const clearButton = screen.getByText('Clear All Filters');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockOnClearAll).toHaveBeenCalled();
  });

  it('should not render clear all button when no filters are active', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={true}
        activeFilterCount={0}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('should render all filter options correctly', () => {
    render(
      <GalleryFilters
        filters={mockFilters}
        filterOptions={mockFilterOptions}
        isOpen={true}
        activeFilterCount={0}
        onToggle={mockOnToggle}
        onUpdateFilter={mockOnUpdateFilter}
        onClearAll={mockOnClearAll}
      />
    );

    // Check years
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();

    // Check categories
    expect(screen.getByText('Widows')).toBeInTheDocument();
    expect(screen.getByText('Orphans')).toBeInTheDocument();
    expect(screen.getByText('Youth')).toBeInTheDocument();
  });
});
