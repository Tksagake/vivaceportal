export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  students: string[];
  materials: Material[];
  assignments: Assignment[];
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document';
  url: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  submittedAt: string;
  content: string;
  grade?: number;
  feedback?: string;
}