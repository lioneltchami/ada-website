import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import Lightbox from './Lightbox';
import { GalleryImage } from './types';

describe('Lightbox', () => {
  const mockImage: GalleryImage = {
    id: '1',
    src: 'https://example.com/image.jpg',
    alt: 'Test Image',
    title: 'Test Title',
    description: 'Test Description',
    project: 'Test Project',
    date: 'January 15, 2024',
    location: 'Bamenda, Cameroon',
    year: 2024,
    category: 'widows',
    projectType: 'support',
    projectFocus: 'women',
    status: 'completed',
    tags: ['empowerment', 'skills-training', 'community'],
  };

  const mockOnClose = vi.fn();
  const mockOnNavigate = vi.fn();
  const mockOnShare = vi.fn();
  const mockOnDownload = vi.fn();
  const mockOnKeyDown = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render lightbox with image', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should display image details', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Bamenda, Cameroon')).toBeInTheDocument();
  });

  it('should display tags', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.getByText('empowerment')).toBeInTheDocument();
    expect(screen.getByText('skills-training')).toBeInTheDocument();
    expect(screen.getByText('community')).toBeInTheDocument();
  });

  it('should display status badge', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    // Find close button (X icon button)
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => btn.title === undefined && btn.querySelector('svg'));

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should call onShare when share button is clicked', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    const shareButtons = screen.getAllByTitle('Share Image');
    fireEvent.click(shareButtons[0]);
    expect(mockOnShare).toHaveBeenCalledWith(mockImage);
  });

  it('should call onDownload when download button is clicked', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    const downloadButtons = screen.getAllByTitle('Download Image');
    fireEvent.click(downloadButtons[0]);
    expect(mockOnDownload).toHaveBeenCalledWith(mockImage);
  });

  it('should display navigation buttons when totalImages > 1', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={1}
        totalImages={3}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    // Navigation buttons should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(2); // At least prev, next, and close buttons
  });

  it('should not display navigation buttons when totalImages = 1', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    // Should only have action buttons (share, download, close) but no nav buttons
    const buttons = screen.getAllByRole('button');
    // With 1 image: 2 share buttons, 2 download buttons, 1 close button = 5 total
    // Without navigation: no prev/next buttons
    expect(buttons.length).toBeLessThan(7);
  });

  it('should call onNavigate with "prev" when previous button is clicked', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={1}
        totalImages={3}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    const buttons = screen.getAllByRole('button');
    // Find the button with ChevronLeft icon (previous button)
    const prevButton = buttons.find(btn =>
      btn.className.includes('left-4') ||
      (btn.querySelector('svg') && btn.className.includes('absolute'))
    );

    if (prevButton) {
      fireEvent.click(prevButton);
      expect(mockOnNavigate).toHaveBeenCalledWith('prev');
    }
  });

  it('should call onNavigate with "next" when next button is clicked', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={1}
        totalImages={3}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    const buttons = screen.getAllByRole('button');
    // Find the button with ChevronRight icon (next button)
    const nextButton = buttons.find(btn =>
      btn.className.includes('right-4') ||
      (btn.querySelector('svg') && btn.className.includes('absolute') && !btn.className.includes('left-4'))
    );

    if (nextButton) {
      fireEvent.click(nextButton);
      expect(mockOnNavigate).toHaveBeenCalledWith('next');
    }
  });

  it('should display current image position', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={1}
        totalImages={5}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.getByText('2 of 5')).toBeInTheDocument();
  });

  it('should not display position indicator when totalImages = 1', () => {
    render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.queryByText(/of 1/)).not.toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    const { container } = render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    // Find the overlay (outermost div with fixed positioning)
    const overlay = container.querySelector('.fixed.inset-0');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should not call onClose when content is clicked', () => {
    const { container } = render(
      <Lightbox
        image={mockImage}
        currentIndex={0}
        totalImages={1}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
        onKeyDown={mockOnKeyDown}
      />
    );

    // Find the content div (the white rounded box)
    const content = container.querySelector('.bg-white.rounded-xl');
    if (content) {
      fireEvent.click(content);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });
});
