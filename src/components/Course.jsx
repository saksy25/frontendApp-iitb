import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, AlertCircle, CheckCircle, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Course form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    courseId: '',
    description: '',
    prerequisites: []
  });

  // Selected course for details
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        throw new Error('Failed to fetch courses');
      }
    } catch (err) {
      showMessage('Error fetching courses: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseForm),
      });
      // Debug: Log the response status and data
    console.log('Response status:', response.status);

      if (response.ok) {
        showMessage('Course created successfully!');
        setCourseForm({ title: '', courseId: '', description: '', prerequisites: [] });
        setShowCourseForm(false);
        fetchCourses();
      } else {
        const errorData = await response.json();
        if (response.status === 400 || response.status === 409) {
          window.alert(`Course with ID "${courseForm.courseId}" already exists`);
        }
        throw new Error(errorData.message || 'Failed to create course');
      }
    } catch (err) {
      showMessage('Error creating course: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('Course deleted successfully!');
        fetchCourses();
      } else if (response.status === 409) {
        showMessage('Cannot delete course: it is a prerequisite for other courses', 'error');
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (err) {
      showMessage('Error deleting course: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedCourse(data);
      } else {
        throw new Error('Failed to fetch course details');
      }
    } catch (err) {
      showMessage('Error fetching course details: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrerequisiteChange = (courseId) => {
    setCourseForm(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(courseId)
        ? prev.prerequisites.filter(id => id !== courseId)
        : [...prev.prerequisites, courseId]
    }));
  };

  const isPrerequisiteForOthers = (courseId) => {
    return courses.some(course => 
      course.prerequisites && course.prerequisites.includes(courseId)
    );
  };

  const filteredCourses = courses.filter(course =>
    searchTerm === '' || course.courseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="mb-6 flex justify-between px-4 items-center">
        <h2 className="text-2xl font-semibold text-blue-950">Courses</h2>
        <div className="px-6 w-3xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Course ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowCourseForm(true)}
          className="bg-blue-700 text-white text-lg px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && filteredCourses.length === 0 && searchTerm && (
          <div className="p-8 text-center text-gray-600">
            No courses found matching "{searchTerm}".
          </div>
        )}

        {!loading && courses.length === 0 && !searchTerm && (
          <div className="p-8 text-center text-gray-600">
            No courses found. Create your first course to get started.
          </div>
        )}

        {!loading && filteredCourses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Prerequisites
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                      {course.courseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.prerequisites && course.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq) => (
                            <span
                              key={prereq}
                              className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                            >
                              {prereq}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewCourseDetails(course.courseId)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.courseId)}
                          disabled={isPrerequisiteForOthers(course.courseId)}
                          className={`${
                            isPrerequisiteForOthers(course.courseId)
                              ? 'text-gray-500 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={
                            isPrerequisiteForOthers(course.courseId)
                              ? 'Cannot delete: course is a prerequisite for other courses'
                              : 'Delete course'
                          }
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCourseForm && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-blue-950">Create New Course</h3>
                <button
                  onClick={() => setShowCourseForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createCourse} className="space-y-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Course ID
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.courseId}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CS 209"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Introduction to Computer Programming"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={courseForm.description}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Course description..."
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Prerequisites
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <label key={course.courseId} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            checked={courseForm.prerequisites.includes(course.courseId)}
                            onChange={() => handlePrerequisiteChange(course.courseId)}
                            className="mr-2"
                          />
                          <span className="text-sm">{course.courseId} - {course.title}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No courses available</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-950">Course Details</h3>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-md font-medium text-gray-700">Course ID</label>
                  <p className="mt-1 text-md text-gray-950">{selectedCourse.courseId}</p>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-md text-gray-950">{selectedCourse.title}</p>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-md text-gray-950">{selectedCourse.description}</p>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Prerequisites</label>
                  {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedCourse.prerequisites.map((prereq) => (
                        <span
                          key={prereq}
                          className="inline-block bg-blue-100 text-blue-800 text-md px-3 py-1 rounded-full"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-md text-gray-500">No prerequisites</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;