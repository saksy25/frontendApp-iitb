import { API_BASE_URL } from '../utils/constants';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Course API functions
export const courseAPI = {
  // Get all courses
  getCourses: async () => {
    return await apiRequest('/courses');
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    return await apiRequest(`/courses/${courseId}`);
  },

  // Create a new course
  createCourse: async (courseData) => {
    return await apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Update an existing course
  updateCourse: async (courseId, courseData) => {
    return await apiRequest(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    return await apiRequest(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Get instances for a specific year and semester
  getInstances: async (year, semester) => {
    return await apiRequest(`/instances/${year}/${semester}`);
  },

  // Get instance details
  getInstanceDetails: async (year, semester, courseId) => {
    return await apiRequest(`/instances/${year}/${semester}/${courseId}`);
  },

  // Create a new course instance
  createInstance: async (instanceData) => {
    return await apiRequest('/instances', {
      method: 'POST',
      body: JSON.stringify(instanceData),
    });
  },

  // Update an existing instance
  updateInstance: async (year, semester, courseId, instanceData) => {
    return await apiRequest(`/instances/${year}/${semester}/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(instanceData),
    });
  },

  // Delete an instance
  deleteInstance: async (year, semester, courseId) => {
    return await apiRequest(`/instances/${year}/${semester}/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Get all instances for a specific course
  getCourseInstances: async (courseId) => {
    return await apiRequest(`/courses/${courseId}/instances`);
  },

  // Get instances by year only
  getInstancesByYear: async (year) => {
    return await apiRequest(`/instances/${year}`);
  },
};

// Generic error handler for API calls
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error.message.includes('409')) {
    return 'Conflict: The resource already exists or cannot be modified.';
  }
  
  if (error.message.includes('404')) {
    return 'Resource not found.';
  }
  
  if (error.message.includes('400')) {
    return 'Invalid request. Please check your input.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Utility function to check if API is available
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default courseAPI;