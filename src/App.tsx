import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { StudentDashboard } from './pages/student/Dashboard';
import { CourseList } from './pages/student/CourseList';
import { ManageCourses } from './pages/teacher/ManageCourses';
import { ManageUsers } from './pages/admin/ManageUsers';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route
            path="manage-courses"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ManageCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;