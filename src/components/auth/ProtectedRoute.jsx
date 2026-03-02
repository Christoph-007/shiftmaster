import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  role, 
  requireApproved = false 
}) => {
  const { isAuthenticated, isLoading, userType, isApproved } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && userType !== role) {
    // Redirect to appropriate dashboard based on role
    if (userType === 'applicant') {
      return <Navigate to="/applicant/dashboard" replace />;
    }
    if (userType === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    }
    if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (requireApproved && userType === 'employer' && !isApproved) {
    // Unapproved employers can only access dashboard and profile
    const allowedPaths = ['/employer/dashboard', '/employer/profile'];
    if (!allowedPaths.includes(location.pathname)) {
      return <Navigate to="/employer/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
