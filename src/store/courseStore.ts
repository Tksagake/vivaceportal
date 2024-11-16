import { create } from 'zustand';
import { Course, Assignment, Material, Submission } from '../types/auth';
import { supabase } from '../lib/supabase';

interface CourseState {
  courses: Course[];
  loading: boolean;
  fetchCourses: () => Promise<void>;
  addMaterial: (courseId: string, material: Omit<Material, 'id' | 'uploadedAt'>) => Promise<void>;
  submitAssignment: (assignmentId: string, content: string) => Promise<void>;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,

  fetchCourses: async () => {
    set({ loading: true });
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          *,
          materials (*),
          assignments (
            *,
            submissions (*)
          )
        `);

      if (error) throw error;
      set({ courses: courses || [] });
    } finally {
      set({ loading: false });
    }
  },

  addMaterial: async (courseId, material) => {
    const { data, error } = await supabase
      .from('materials')
      .insert([
        {
          ...material,
          courseId,
          uploadedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const courses = get().courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          materials: [...course.materials, data],
        };
      }
      return course;
    });

    set({ courses });
  },

  submitAssignment: async (assignmentId, content) => {
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          assignmentId,
          content,
          submittedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const courses = get().courses.map(course => ({
      ...course,
      assignments: course.assignments.map(assignment => {
        if (assignment.id === assignmentId) {
          return {
            ...assignment,
            submissions: [...assignment.submissions, data],
          };
        }
        return assignment;
      }),
    }));

    set({ courses });
  },

  gradeSubmission: async (submissionId, grade, feedback) => {
    const { data, error } = await supabase
      .from('submissions')
      .update({ grade, feedback })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;

    const courses = get().courses.map(course => ({
      ...course,
      assignments: course.assignments.map(assignment => ({
        ...assignment,
        submissions: assignment.submissions.map(submission =>
          submission.id === submissionId ? data : submission
        ),
      })),
    }));

    set({ courses });
  },
}));