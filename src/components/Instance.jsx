import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const CourseInstance = () => {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Instance form states
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const [instanceForm, setInstanceForm] = useState({
    courseId: '',
    year: new Date().getFullYear(),
    semester: 1
  });

  // Instance listing states
  const [instanceFilter, setInstanceFilter] = useState({
    year: new Date().getFullYear(),
    semester: 1
  });

  // Selected instance for details
  const [selectedInstance, setSelectedInstance] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchInstances(instanceFilter.year, instanceFilter.semester);
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
    }
  };

  const fetchInstances = async (year, semester) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}`);
      if (response.ok) {
        const data = await response.json();
        // Transform the data to flatten the nested course structure
        const transformedData = data.map(instance => ({
          ...instance,
          courseId: instance.course?.courseId || instance.courseId,
          title: instance.course?.title || instance.title,
          description: instance.course?.description || instance.description,
          prerequisites: instance.course?.prerequisites || instance.prerequisites || []
        }));
        setInstances(transformedData);
      } else {
        throw new Error('Failed to fetch instances');
      }
    } catch (err) {
      showMessage('Error fetching instances: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createInstance = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/instances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instanceForm),
      });

      if (response.ok) {
        showMessage('Course instance created successfully!');
        setInstanceForm({ courseId: '', year: new Date().getFullYear(), semester: 1 });
        setShowInstanceForm(false);
        fetchInstances(instanceFilter.year, instanceFilter.semester);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create instance');
      }
    } catch (err) {
      showMessage('Error creating instance: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteInstance = async (year, semester, courseId) => {
    if (!window.confirm('Are you sure you want to delete this course instance?')) return;

    setLoading(true);
    try {
      // Encode courseId to handle spaces and special characters
      const encodedCourseId = encodeURIComponent(courseId);
      const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}/${encodedCourseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('Course instance deleted successfully!');
        fetchInstances(instanceFilter.year, instanceFilter.semester);
        // Close details modal if the deleted instance is currently selected
        if (selectedInstance && 
            selectedInstance.courseId === courseId && 
            selectedInstance.year === year && 
            selectedInstance.semester === semester) {
          setSelectedInstance(null);
        }
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to delete instance';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      showMessage('Error deleting instance: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewInstanceDetails = async (year, semester, courseId) => {
    setLoading(true);
    try {
      // Encode courseId to handle spaces and special characters
      const encodedCourseId = encodeURIComponent(courseId);
      const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}/${encodedCourseId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform the nested course data to flat structure
        const transformedData = {
          ...data,
          courseId: data.course?.courseId || data.courseId,
          title: data.course?.title || data.title,
          description: data.course?.description || data.description,
          prerequisites: data.course?.prerequisites || data.prerequisites || []
        };
        setSelectedInstance(transformedData);
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to fetch instance details';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      showMessage('Error fetching instance details: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.courseId === courseId);
    return course ? course.title : courseId;
  };

  const getCourseById = (courseId) => {
    return courses.find(c => c.courseId === courseId);
  };

  const handleFilterChange = (newFilter) => {
    setInstanceFilter(newFilter);
    fetchInstances(newFilter.year, newFilter.semester);
  };

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

      <div className="mb-6 flex justify-between px-2 items-center">
        <h2 className="text-2xl font-semibold text-blue-950">Course Instances</h2>
        <button
          onClick={() => setShowInstanceForm(true)}
          className="bg-blue-700 text-white text-lg px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Instance
        </button>
      </div>

      {/* Instance Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            min="2020"
            max="2030"
            value={instanceFilter.year}
            onChange={(e) => setInstanceFilter(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-md"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">Semester</label>
          <select
            value={instanceFilter.semester}
            onChange={(e) => setInstanceFilter(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-md"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <button
          onClick={() => handleFilterChange(instanceFilter)}
          className="bg-gray-600 text-white px-4 py-1 rounded-md hover:bg-gray-700 text-md mt-6"
        >
          Filter
        </button>
      </div>

      {/* Instance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && instances.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No course instances found for {instanceFilter.year} semester {instanceFilter.semester}.
          </div>
        )}

        {!loading && instances.length > 0 && (
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
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instances.map((instance, index) => (
                  <tr key={`${instance.courseId}-${instance.year}-${instance.semester}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                      {instance.courseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {instance.title || 'Course title not found'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {instance.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {instance.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewInstanceDetails(instance.year, instance.semester, instance.courseId)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => deleteInstance(instance.year, instance.semester, instance.courseId)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete instance"
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

      {/* Create Instance Modal */}
      {showInstanceForm && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-950">Create Course Instance</h3>
                <button
                  onClick={() => setShowInstanceForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createInstance} className="space-y-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    required
                    value={instanceForm.courseId}
                    onChange={(e) => setInstanceForm(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course...</option>
                    {courses.map((course) => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.courseId} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    required
                    min="2020"
                    max="2030"
                    value={instanceForm.year}
                    onChange={(e) => setInstanceForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    required
                    value={instanceForm.semester}
                    onChange={(e) => setInstanceForm(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInstanceForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Instance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Instance Details Modal */}
      {selectedInstance && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-950">Course Instance Details</h3>
                <button
                  onClick={() => setSelectedInstance(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-md font-medium text-gray-700">Course ID</label>
                  <p className="mt-1 text-md text-gray-950">{selectedInstance.courseId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Title</label>
                  <p className="mt-1 text-md text-gray-950">
                    {selectedInstance.title || 'Title not available'}
                  </p>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Year</label>
                  <p className="mt-1 text-md text-gray-950">{selectedInstance.year}</p>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Semester</label>
                  <p className="mt-1 text-md text-gray-950">{selectedInstance.semester}</p>
                </div>
                {selectedInstance.description && (
                  <div>
                    <label className="block text-md font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-md text-gray-950">{selectedInstance.description}</p>
                  </div>
                )}
                {selectedInstance.prerequisites && selectedInstance.prerequisites.length > 0 && (
                  <div>
                    <label className="block text-md font-medium text-gray-700">Prerequisites</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedInstance.prerequisites.map((prereq, index) => (
                        <span
                          key={`${prereq}-${index}`}
                          className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedInstance(null)}
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

export default CourseInstance;