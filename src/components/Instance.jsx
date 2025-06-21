import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, X } from 'lucide-react';
import { courseAPI } from '../services/api';

const CourseInstances = () => {
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
      const data = await courseAPI.getCourses();
      setCourses(data);
    } catch (err) {
      showMessage('Error fetching courses: ' + err.message, 'error');
    }
  };

  const fetchInstances = async (year, semester) => {
    setLoading(true);
    try {
      const data = await courseAPI.getInstances(year, semester);
      setInstances(data);
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
      await courseAPI.createInstance(instanceForm);
      showMessage('Course instance created successfully!');
      setInstanceForm({ courseId: '', year: new Date().getFullYear(), semester: 1 });
      setShowInstanceForm(false);
      fetchInstances(instanceFilter.year, instanceFilter.semester);
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
      await courseAPI.deleteInstance(year, semester, courseId);
      showMessage('Course instance deleted successfully!');
      fetchInstances(instanceFilter.year, instanceFilter.semester);
    } catch (err) {
      showMessage('Error deleting instance: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewInstanceDetails = async (year, semester, courseId) => {
    setLoading(true);
    try {
      const data = await courseAPI.getInstanceDetails(year, semester, courseId);
      setSelectedInstance(data);
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

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <span className="mr-2">✓</span>
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <span className="mr-2">⚠</span>
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Course Instances</h2>
        <button
          onClick={() => setShowInstanceForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Instance
        </button>
      </div>

      {/* Instance Filter */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={instanceFilter.year}
            onChange={(e) => setInstanceFilter(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select
            value={instanceFilter.semester}
            onChange={(e) => setInstanceFilter(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <button
          onClick={() => fetchInstances(instanceFilter.year, instanceFilter.semester)}
          className="bg-gray-600 text-white px-4 py-1 rounded-md hover:bg-gray-700 text-sm"
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
          <div className="p-8 text-center text-gray-500">
            No course instances found for {instanceFilter.year} semester {instanceFilter.semester}.
          </div>
        )}

        {!loading && instances.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instances.map((instance, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {instance.courseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCourseTitle(instance.courseId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewInstanceDetails(instance.year, instance.semester, instance.courseId)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInstance(instance.year, instance.semester, instance.courseId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Course Instance</h3>
                <button
                  onClick={() => setShowInstanceForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createInstance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Course Instance Details</h3>
                <button
                  onClick={() => setSelectedInstance(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInstance.courseId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Title</label>
                  <p className="mt-1 text-sm text-gray-900">{getCourseTitle(selectedInstance.courseId)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInstance.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInstance.semester}</p>
                </div>
                {selectedInstance.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInstance.description}</p>
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

export default CourseInstances;