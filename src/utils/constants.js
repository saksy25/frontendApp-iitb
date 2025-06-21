// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// Application Constants
export const APP_NAME = 'Course Management System';
export const APP_VERSION = '1.0.0';

// UI Constants
export const ITEMS_PER_PAGE = 10;
export const DEBOUNCE_DELAY = 300;

// Form Validation Constants
export const FORM_VALIDATION = {
  COURSE_ID: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z]{2,4}\s?\d{3,4}$/i, // e.g., CS 101, MATH1001
  },
  COURSE_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  YEAR: {
    MIN: 2020,
    MAX: 2030,
  },
  SEMESTER: {
    MIN: 1,
    MAX: 2,
  },
};

// Semester Configuration
export const SEMESTERS = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
];

// Year Range for Dropdowns
export const YEAR_RANGE = {
  START: 2020,
  END: 2030,
};

// Generate array of years for dropdowns
export const AVAILABLE_YEARS = Array.from(
  { length: YEAR_RANGE.END - YEAR_RANGE.START + 1 },
  (_, i) => YEAR_RANGE.START + i
);

// Status Constants
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  COURSE_NOT_FOUND: 'Course not found.',
  INSTANCE_NOT_FOUND: 'Course instance not found.',
  PREREQUISITE_CONFLICT: 'Cannot delete course: it is a prerequisite for other courses.',
  INSTANCE_EXISTS: 'Course instance already exists for this year and semester.',
  INVALID_COURSE_ID: 'Invalid course ID format. Use format like "CS 101" or "MATH1001".',
  TITLE_TOO_SHORT: 'Course title must be at least 5 characters long.',
  DESCRIPTION_TOO_SHORT: 'Description must be at least 10 characters long.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  COURSE_CREATED: 'Course created successfully!',
  COURSE_UPDATED: 'Course updated successfully!',
  COURSE_DELETED: 'Course deleted successfully!',
  INSTANCE_CREATED: 'Course instance created successfully!',
  INSTANCE_UPDATED: 'Course instance updated successfully!',
  INSTANCE_DELETED: 'Course instance deleted successfully!',
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  GRAY: '#6B7280',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'cms_theme',
  USER_PREFERENCES: 'cms_user_preferences',
  LAST_FILTER: 'cms_last_filter',
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  INSTANCES: '/instances',
  DASHBOARD: '/dashboard',
};

// Component Display Names
export const COMPONENT_NAMES = {
  COURSES: 'Courses',
  INSTANCES: 'Course Instances',
  DASHBOARD: 'Dashboard',
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
};

// Default Values
export const DEFAULTS = {
  CURRENT_YEAR: new Date().getFullYear(),
  CURRENT_SEMESTER: 1,
  EMPTY_COURSE: {
    title: '',
    courseId: '',
    description: '',
    prerequisites: [],
  },
  EMPTY_INSTANCE: {
    courseId: '',
    year: new Date().getFullYear(),
    semester: 1,
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  required: (value) => value && value.toString().trim() !== '',
  minLength: (min) => (value) => value && value.length >= min,
  maxLength: (max) => (value) => value && value.length <= max,
  pattern: (regex) => (value) => regex.test(value),
  range: (min, max) => (value) => value >= min && value <= max,
};

// Common Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  COURSE_CODE: /^[A-Z]{2,4}\s?\d{3,4}$/i,
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  EXPORT_DATA: true,
  BULK_OPERATIONS: false,
  ADVANCED_SEARCH: false,
};

export default {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  FORM_VALIDATION,
  SEMESTERS,
  AVAILABLE_YEARS,
  STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLORS,
  STORAGE_KEYS,
  ROUTES,
  COMPONENT_NAMES,
  ANIMATION,
  BREAKPOINTS,
  DEFAULTS,
  VALIDATION_RULES,
  PATTERNS,
  FEATURES,
};