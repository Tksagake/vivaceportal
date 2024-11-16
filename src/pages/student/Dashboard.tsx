import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { Book, Calendar, CheckCircle } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { courses, loading, fetchCourses } = useCourseStore();

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const upcomingAssignments = React.useMemo(() => {
    return courses
      .flatMap(course =>
        course.assignments.map(assignment => ({
          ...assignment,
          courseName: course.name,
        }))
      )
      .filter(assignment => new Date(assignment.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [courses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.name}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Book className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">Enrolled Courses</h3>
            </div>
            <p className="text-2xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Upcoming Assignments</h3>
            </div>
            <p className="text-2xl font-bold">{upcomingAssignments.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Completed Assignments</h3>
            </div>
            <p className="text-2xl font-bold">
              {courses.reduce(
                (acc, course) =>
                  acc +
                  course.assignments.reduce(
                    (acc2, assignment) =>
                      acc2 + assignment.submissions.filter(s => s.grade != null).length,
                    0
                  ),
                0
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Assignments</h3>
          <div className="space-y-4">
            {upcomingAssignments.map(assignment => (
              <div
                key={assignment.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-gray-500">{assignment.courseName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(assignment.dueDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {upcomingAssignments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming assignments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};