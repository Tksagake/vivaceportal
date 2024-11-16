import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold">School Portal</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Dashboard
              </Link>
            </li>
            {user?.role === 'student' && (
              <>
                <li>
                  <Link
                    to="/courses"
                    className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assignments"
                    className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Assignments
                  </Link>
                </li>
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <li>
                  <Link
                    to="/manage-courses"
                    className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Manage Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/grade-assignments"
                    className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Grade Assignments
                  </Link>
                </li>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <li>
                  <Link
                    to="/users"
                    className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Manage Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/system-settings"
                    className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    System Settings
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};