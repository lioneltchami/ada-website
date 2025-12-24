import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import GalleryGrid from './GalleryGrid';
import { GalleryImage } from './types';

describe('GalleryGrid', () => {
  const mockImages: GalleryImage[] = [
    {
      id: '1',
      src: 'https://example.com/image1.jpg',
      alt: 'Test Image 1',
      title: 'Test Title 1',
      description: 'Test Description 1',
      project: 'Test Project 1',
      date: '2024-01-01',
      location: 'Test Location',
      year: 2024,
      category: 'widows',
      projectType: 'support',
      projectFocus: 'women',
      status: 'completed',
      tags: ['tag1', 'tag2'],
    },
    {
      id: '2',
      src: 'https://example.com/image2.jpg',
      alt: 'Test Image 2',
      title: 'Test Title 2',
      description: 'Test Description 2',
      project: 'Test Project 2',
      date: '2024-02-01',
      location: 'Test Location 2',
      year: 2024,
      category: 'orphans',
      projectType: 'training',
      projectFocus: 'children',
      status: 'ongoing',
      tags: ['tag3'],
      subImages: [
        {
          id: '2a',
          src: 'https://example.com/image2a.jpg',
          alt: 'Sub Image',
          title: 'Sub Title',
          description: 'Sub Description',
          project: 'Test Project 2',
          date: '2024-02-01',
          location: 'Test Location 2',
          year: 2024,
          category: 'orphans',
          projectType: 'training',
          projectFocus: 'children',
          status: 'ongoing',
          tags: [],
          parentId: '2',
        },
      ],
    },
  ];

  const mockOnImageClick = vi.fn();
  const mockOnClearFilters = vi.fn();

  it('should render images in grid view', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.getByText('Test Title 1')).toBeInTheDocument();
    expect(screen.getByText('Test Title 2')).toBeInTheDocument();
  });

  it('should render images in masonry view', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="masonry"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.getByText('Test Title 1')).toBeInTheDocument();
    expect(screen.getByText('Test Title 2')).toBeInTheDocument();
  });

  it('should call onImageClick when image is clicked', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    const imageCard = screen.getByText('Test Title 1').closest('div');
    if (imageCard) {
      fireEvent.click(imageCard);
      expect(mockOnImageClick).toHaveBeenCalledWith(mockImages[0]);
    }
  });

  it('should display status badges correctly', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('should display sub-image indicator for images with subImages', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.getByText('1+ photos')).toBeInTheDocument();
  });

  it('should render empty state when no images', () => {
    render(
      <GalleryGrid
        images={[]}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByText(/No images found/i)).toBeInTheDocument();
    const clearButton = screen.getByText(/clear all filters/i);
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('should not render clear filters button in empty state when onClearFilters is not provided', () => {
    render(
      <GalleryGrid
        images={[]}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('should render image descriptions on hover', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });

  it('should display project names and dates', () => {
    render(
      <GalleryGrid
        images={mockImages}
        viewMode="grid"
        currentView="main"
        onImageClick={mockOnImageClick}
      />
    );

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('2024-02-01')).toBeInTheDocument();
  });
});
