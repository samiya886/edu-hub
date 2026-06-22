import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/auth' }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

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
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
