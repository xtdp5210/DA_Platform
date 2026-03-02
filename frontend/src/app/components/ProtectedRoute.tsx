import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/authStore";

interface Props {
  children: React.ReactNode;
  /** If true, redirects authenticated users away (e.g. login/register pages) */
  guestOnly?: boolean;
}

const ProtectedRoute = ({ children, guestOnly = false }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;