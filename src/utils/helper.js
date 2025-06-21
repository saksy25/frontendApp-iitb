import { FORM_VALIDATION, ERROR_MESSAGES, PATTERNS } from './constants';

// Validation Utilities
export const validateCourseId = (courseId) => {
  if (!courseId || courseId.trim() === '') {
    return 'Course ID is required';
  }
  
  if (courseId.length < FORM_VALIDATION.COURSE_ID.MIN_LENGTH) {
    return `Course ID must be at least ${FORM_VALIDATION.COURSE_ID.MIN_LENGTH} characters`;
  }
  
  if (courseId.length > FORM_VALIDATION.COURSE_ID.MAX_LENGTH) {
    return `Course ID must be no more than ${FORM_VALIDATION.COURSE_ID.MAX_LENGTH} characters`;
  }
  
  if (!PATTERNS.COURSE_CODE.test(courseId)) {
    return ERROR_MESSAGES.INVALID_COURSE_ID;
  }
  
  return null;
};

export const validateCourseTitle = (title) => {
  if (!title || title.trim() === '') {
    return 'Course title is required';
  }
  
  if (title.length < FORM_VALIDATION.COURSE_TITLE.MIN_LENGTH) {
    return ERROR_MESSAGES.TITLE_TOO_SHORT;
  }
  
  if (title.length > FORM_VALIDATION.COURSE_TITLE.MAX_LENGTH) {
    return `Course title must be no more than ${FORM_VALIDATION.COURSE_TITLE.MAX_LENGTH} characters`;
  }
  
  return null;
};

export const validateDescription = (description) => {
  if (!description || description.trim() === '') {
    return 'Description is required';
  }
  
  if (description.length < FORM_VALIDATION.DESCRIPTION.MIN_LENGTH) {
    return ERROR_MESSAGES.DESCRIPTION_TOO_SHORT;
  }
  
  if (description.length > FORM_VALIDATION.DESCRIPTION.MAX_LENGTH) {
    return `Description must be no more than ${FORM_VALIDATION.DESCRIPTION.MAX_LENGTH} characters`;
  }
  
  return null;
};

export const validateYear = (year) => {
  const numYear = parseInt(year);
  
  if (isNaN(numYear)) {
    return 'Year must be a valid number';
  }
  
  if (numYear < FORM_VALIDATION.YEAR.MIN || numYear > FORM_VALIDATION.YEAR.MAX) {
    return `Year must be between ${FORM_VALIDATION.YEAR.MIN} and ${FORM_VALIDATION.YEAR.MAX}`;
  }
  
  return null;
};

export const validateSemester = (semester) => {
  const numSemester = parseInt(semester);
  
  if (isNaN(numSemester)) {
    return 'Semester must be a valid number';
  }
  
  if (numSemester < FORM_VALIDATION.SEMESTER.MIN || numSemester > FORM_VALIDATION.SEMESTER.MAX) {
    return `Semester must be between ${FORM_VALIDATION.SEMESTER.MIN} and ${FORM_VALIDATION.SEMESTER.MAX}`;
  }
  
  return null;
};

// Course form validation
export const validateCourseForm = (courseData) => {
  const errors = {};
  
  const courseIdError = validateCourseId(courseData.courseId);
  if (courseIdError) errors.courseId = courseIdError;
  
  const titleError = validateCourseTitle(courseData.title);
  if (titleError) errors.title = titleError;
  
  const descriptionError = validateDescription(courseData.description);
  if (descriptionError) errors.description = descriptionError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Instance form validation
export const validateInstanceForm = (instanceData) => {
  const errors = {};
  
  if (!instanceData.courseId || instanceData.courseId.trim() === '') {
    errors.courseId = 'Please select a course';
  }
  
  const yearError = validateYear(instanceData.year);
  if (yearError) errors.year = yearError;
  
  const semesterError = validateSemester(instanceData.semester);
  if (semesterError) errors.semester = semesterError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Utility Functions
export const formatCourseId = (courseId) => {
  if (!courseId) return '';
  return courseId.toUpperCase().replace(/\s+/g, ' ').trim();
};

export const formatYear = (year) => {
  return parseInt(year) || new Date().getFullYear();
};

export const formatSemester = (semester) => {
  return parseInt(semester) || 1;
};

export const getSemesterLabel = (semester) => {
  return `Semester ${semester}`;
};

export const getYearSemesterLabel = (year, semester) => {
  return `${year} ${getSemesterLabel(semester)}`;
};

// Data manipulation utilities
export const sortCoursesByCode = (courses) => {
  return [...courses].sort((a, b) => a.courseId.localeCompare(b.courseId));
};

export const sortInstancesByYearSemester = (instances) => {
  return [...instances].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year; // Newest year first
    }
    return b.semester - a.semester; // Highest semester first
  });
};

export const filterCoursesBySearch = (courses, searchTerm) => {
  if (!searchTerm) return courses;
  
  const term = searchTerm.toLowerCase();
  return courses.filter(course => 
    course.courseId.toLowerCase().includes(term) ||
    course.title.toLowerCase().includes(term) ||
    course.description.toLowerCase().includes(term)
  );
};

export const filterInstancesByYearSemester = (instances, year, semester) => {
  return instances.filter(instance => 
    instance.year === year && instance.semester === semester
  );
};

// Prerequisites utilities
export const hasPrerequisites = (course) => {
  return course.prerequisites && course.prerequisites.length > 0;
};

export const isPrerequisiteFor = (courseId, courses) => {
  return courses.some(course => 
    course.prerequisites && course.prerequisites.includes(courseId)
  );
};

export const getPrerequisiteChain = (courseId, courses) => {
  const course = courses.find(c => c.courseId === courseId);
  if (!course || !hasPrerequisites(course)) {
    return [];
  }
  
  return course.prerequisites.map(prereqId => {
    const prereqCourse = courses.find(c => c.courseId === prereqId);
    return prereqCourse ? prereqCourse : { courseId: prereqId, title: 'Unknown Course' };
  });
};

// Error handling utilities
export const getErrorMessage = (error, defaultMessage = ERROR_MESSAGES.GENERIC_ERROR) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return defaultMessage;
};

export const isNetworkError = (error) => {
  return !error.response || error.code === 'NETWORK_ERROR';
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Debounce utility for search
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Format utilities
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Date utilities
export const getCurrentYear = () => new Date().getFullYear();

export const getCurrentSemester = () => {
  const month = new Date().getMonth() + 1; // 0-based to 1-based
  return month <= 6 ? 1 : 2; // Assuming semester 1 is Jan-June, semester 2 is July-Dec
};

export const isCurrentYearSemester = (year, semester) => {
  return year === getCurrentYear() && semester === getCurrentSemester();
};

// Export all utilities as default object
export default {
  validateCourseId,
  validateCourseTitle,
  validateDescription,
  validateYear,
  validateSemester,
  validateCourseForm,
  validateInstanceForm,
  formatCourseId,
  formatYear,
  formatSemester,
  getSemesterLabel,
  getYearSemesterLabel,
  sortCoursesByCode,
  sortInstancesByYearSemester,
  filterCoursesBySearch,
  filterInstancesByYearSemester,
  hasPrerequisites,
  isPrerequisiteFor,
  getPrerequisiteChain,
  getErrorMessage,
  isNetworkError,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  debounce,
  capitalize,
  truncateText,
  getCurrentYear,
  getCurrentSemester,
  isCurrentYearSemester
};