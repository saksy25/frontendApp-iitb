import React, { useState, useEffect } from 'react';
import { Book, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import Course from '../components/Course';
import CourseInstances from '../components/Instance';
import { fetchCourses, fetchInstances } from '../services/api';

const CoursesApp = () => {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('courses');

  // Instance listing states
  const [instanceFilter, setInstanceFilter] = useState({
    year: new Date().getFullYear(),
    semester: 1
  });

  useEffect(() => {
    loadCourses();
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

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      showMessage('Error fetching courses: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadInstances = async (year, semester) => {
    setLoading(true);
    try {
      const data = await fetchInstances(year, semester);
      setInstances(data);
    } catch (err) {
      showMessage('Error fetching instances: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'instances') {
      loadInstances(instanceFilter.year, instanceFilter.semester);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Management System</h1>

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

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('courses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Book className="w-4 h-4 inline mr-2" />
                Courses
              </button>
              <button
                onClick={() => handleTabChange('instances')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'instances'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Course Instances
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <Course
            courses={courses}
            loading={loading}
            onCoursesChange={loadCourses}
            onMessage={showMessage}
            onLoadingChange={setLoading}
          />
        )}

        {activeTab === 'instances' && (
          <CourseInstances
            instances={instances}
            courses={courses}
            loading={loading}
            instanceFilter={instanceFilter}
            setInstanceFilter={setInstanceFilter}
            onInstancesChange={loadInstances}
            onMessage={showMessage}
            onLoadingChange={setLoading}
          />
        )}
      </div>
    </div>
  );
};

export default CoursesApp;