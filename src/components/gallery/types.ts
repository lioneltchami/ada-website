// Gallery component shared types

export interface GalleryImage {
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

export interface GalleryFilters {
  year: string;
  category: string;
  projectType: string;
  projectFocus: string;
  status: string;
  search: string;
}

export interface FilterOptions {
  years: number[];
  categories: string[];
  projectTypes: string[];
  projectFocuses: string[];
  statuses: string[];
}

export type ViewMode = 'grid' | 'masonry';
export type ViewType = 'main' | 'sub';
