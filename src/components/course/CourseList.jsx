import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const CourseList = ({ courses, loading, onViewDetails, onDelete, isPrerequisiteForOthers }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No courses found. Create your first course to get started.
      </div>
    );
  }

  return (
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
              Prerequisites
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course.courseId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {course.courseId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {course.title}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {course.prerequisites && course.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq) => (
                      <span
                        key={prereq}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(course.courseId)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(course.courseId)}
                    disabled={isPrerequisiteForOthers(course.courseId)}
                    className={`${
                      isPrerequisiteForOthers(course.courseId)
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-900'
                    }`}
                    title={
                      isPrerequisiteForOthers(course.courseId)
                        ? 'Cannot delete: course is a prerequisite for other courses'
                        : 'Delete course'
                    }
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
  );
};

export default CourseList;