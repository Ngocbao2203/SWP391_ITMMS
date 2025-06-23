import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services';
import { message } from 'antd';

/**
 * AuthGuard component to protect routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string|Array} props.requiredRoles - Required roles to access the route
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/login')
 */
const AuthGuard = ({ 
  children, 
  requiredRoles = null, 
  redirectTo = '/login',
  showMessage = true 
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (showMessage) {
      message.warning('Vui lòng đăng nhập để tiếp tục');
    }
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check roles if required
  if (requiredRoles) {
    const hasRequiredRole = authService.hasRole(requiredRoles);
    
    if (!hasRequiredRole) {
      if (showMessage) {
        message.error('Bạn không có quyền truy cập trang này');
      }
      
      // Redirect based on user role
      const userRole = currentUser?.role;
      let defaultRoute = '/';
      
      switch (userRole) {
        case 'Admin':
          defaultRoute = '/admin/dashboard';
          break;
        case 'Manager':
          defaultRoute = '/manager/doctors';
          break;
        case 'Doctor':
          defaultRoute = '/doctor/dashboard';
          break;
        case 'Customer':
          defaultRoute = '/profile';
          break;
        default:
          defaultRoute = '/';
      }
      
      return <Navigate to={defaultRoute} replace />;
    }
  }

  // Render the protected component
  return children;
};

/**
 * GuestGuard component to redirect authenticated users away from guest-only pages
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if not authenticated
 * @param {string} props.redirectTo - Path to redirect if authenticated
 */
export const GuestGuard = ({ 
  children, 
  redirectTo = null 
}) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (isAuthenticated && currentUser) {
    // Redirect based on user role
    let defaultRoute = redirectTo;
    
    if (!defaultRoute) {
      switch (currentUser.role) {
        case 'Admin':
          defaultRoute = '/admin/dashboard';
          break;
        case 'Manager':
          defaultRoute = '/manager/doctors';
          break;
        case 'Doctor':
          defaultRoute = '/doctor/dashboard';
          break;
        case 'Customer':
          defaultRoute = '/profile';
          break;
        default:
          defaultRoute = '/';
      }
    }
    
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

/**
 * RoleGuard component to show different content based on user roles
 * @param {Object} props
 * @param {string|Array} props.allowedRoles - Roles that can see the content
 * @param {React.ReactNode} props.children - Content to show if user has allowed role
 * @param {React.ReactNode} props.fallback - Content to show if user doesn't have allowed role
 */
export const RoleGuard = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  const hasRole = authService.hasRole(allowedRoles);
  
  return hasRole ? children : fallback;
};

/**
 * useAuth hook to get current authentication state
 */
export const useAuth = () => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  return {
    isAuthenticated,
    user: currentUser,
    hasRole: (roles) => authService.hasRole(roles),
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    updateProfile: authService.updateProfile.bind(authService)
  };
};

export default AuthGuard; 