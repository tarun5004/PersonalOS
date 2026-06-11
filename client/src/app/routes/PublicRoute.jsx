import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth.js';
import { RouteLoading } from './RouteLoading.jsx';

export function PublicRoute({ children }) {
  const { isAuthenticated, isRestoring } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isRestoring) {
    return <RouteLoading />;
  }

  if (isAuthenticated) {
    return <Navigate replace to={from} />;
  }

  return children || <Outlet />;
}
