import React from 'react';
import { useCourseStore } from '../../store/courseStore';
import { Plus, Book, Users, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type CourseForm = z.infer<typeof courseSchema>;

export const ManageCourses: React.FC = () => {
  const { courses, loading, createCourse } = useCourseStore();
  const [isModalOpen, setModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseForm) => {
    try {
      await createCourse(data);
      setModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          <span>New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Book className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold">{course.name}</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">{course.code}</span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Students</span>
                  </div>
                  <span className="font-medium">{course.students.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Materials</span>
                  </div>
                  <span className="font-medium">{course.materials.length}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex space-x-2">
              <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Manage
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">
                Students
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Course</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Code</label>
                <input
                  type="text"
                  {...register('code')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};