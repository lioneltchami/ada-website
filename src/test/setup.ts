import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend expect with jest-dom matchers
expect.extend({});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock environment variables
process.env.VITE_ORG_NAME = 'Test Organization';
process.env.VITE_ORG_EMAIL = 'test@example.org';
process.env.VITE_ORG_PHONE = '+237 123 456 789';
process.env.VITE_ORG_LOCATION = 'Test Location';
process.env.VITE_SOCIAL_FACEBOOK = 'https://facebook.com/test';
process.env.VITE_SOCIAL_INSTAGRAM = 'https://instagram.com/test';
process.env.VITE_SOCIAL_TWITTER = 'https://twitter.com/test';
process.env.VITE_TAX_ID = '12345678';
process.env.VITE_API_URL = 'https://api.test.com';
process.env.VITE_EMAILJS_SERVICE_ID = 'test_service';
process.env.VITE_EMAILJS_TEMPLATE_ID = 'test_template';
process.env.VITE_EMAILJS_PUBLIC_KEY = 'test_public_key';
