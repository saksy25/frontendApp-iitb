import React, { useState } from 'react';
import Courses from '../components/Course'; // Adjust path as needed
import CourseInstances from '../components/Instance'; // Adjust path as needed

const CourseApp = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Instance filter state for Course Instances tab
  const [instanceFilter, setInstanceFilter] = useState({
    year: new Date().getFullYear(),
    semester: 1
  });

  // Function to fetch instances (you can customize this based on your needs)
  const fetchInstances = (year, semester) => {
    // This function should be implemented based on your CourseInstances component logic
    console.log(`Fetching instances for year: ${year}, semester: ${semester}`);
    // You might want to pass this function to CourseInstances component
  };

  // Clear messages after some time
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-blue-900">
            Course Management System
          </h1>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b-2 border-gray-400 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-xl ${
                activeTab === 'courses'
                  ? 'border-blue-700 border-b-4 text-blue-600'
                  : 'border-transparent text-gray-700 hover:text-gray-700 hover:border-gray-400'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => {
                setActiveTab('instances');
                fetchInstances(instanceFilter.year, instanceFilter.semester);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-xl ${
                activeTab === 'instances'
                  ? 'border-blue-700 border-b-4 text-blue-600'
                  : 'border-transparent text-gray-700 hover:text-gray-500 hover:border-gray-300'
              }`}
            >
              Course Instances
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg mb-4 p-4 shadow">
          {activeTab === 'courses' && (
            <Courses 
              setSuccess={setSuccess}
              setError={setError}
            />
          )}
          {activeTab === 'instances' && (
            <CourseInstances 
              setSuccess={setSuccess}
              setError={setError}
              instanceFilter={instanceFilter}
              setInstanceFilter={setInstanceFilter}
              fetchInstances={fetchInstances}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseApp;