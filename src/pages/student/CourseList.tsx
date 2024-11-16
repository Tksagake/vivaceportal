import React from 'react';
import { useCourseStore } from '../../store/courseStore';
import { Book, FileText, Calendar } from 'lucide-react';

export const CourseList: React.FC = () => {
  const { courses, loading, fetchCourses } = useCourseStore();

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Book className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">{course.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Materials</span>
                  </div>
                  <span className="font-medium">{course.materials.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Assignments</span>
                  </div>
                  <span className="font-medium">{course.assignments.length}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
          <p className="mt-1 text-sm text-gray-500">
            You are not enrolled in any courses yet.
          </p>
        </div>
      )}
    </div>
  );
};