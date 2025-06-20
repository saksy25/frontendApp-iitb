import React from 'react';
import { X } from 'lucide-react';

const CourseDetails = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Course Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course ID</label>
              <p className="mt-1 text-sm text-gray-900">{course.courseId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <p className="mt-1 text-sm text-gray-900">{course.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900">{course.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prerequisites</label>
              {course.prerequisites && course.prerequisites.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {course.prerequisites.map((prereq) => (
                    <span
                      key={prereq}
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">No prerequisites</p>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;