import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const normalizeRole = (role) => String(role || '').trim().toLowerCase();

const getDashboardPath = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'admin') return '/admin';
  if (normalizedRole === 'teacher') return '/teacher';
  if (normalizedRole === 'student') return '/student';

  return '/auth';
};

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/auth' }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedRequiredRole = normalizeRole(requiredRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a4a44]">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-[#ff9f1c]/30 border-t-[#ff9f1c] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (normalizedRequiredRole && normalizedUserRole !== normalizedRequiredRole) {
    return <Navigate to={getDashboardPath(normalizedUserRole)} replace />;
  }

  return children;
};

export default ProtectedRoute;