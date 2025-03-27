
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'educator';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // If still loading, show nothing or a loading spinner
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If not logged in at all
  if (!user) {
    toast({
      title: "Access denied",
      description: "You need to be logged in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  // If a specific role is required and user doesn't have it
  if (requiredRole && user.role !== requiredRole) {
    toast({
      title: "Permission denied",
      description: `Only ${requiredRole}s can access this page.`,
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
