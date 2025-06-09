
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('client' | 'vendor' | 'admin')[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'admin' ? '/admin' : 
                        user.role === 'vendor' ? '/vendor' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
