import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../lib/apiClient.js';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from './authApi.js';

const PUBLIC_AUTH_PATHS = new Set(['/login', '/register']);

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');
  const hasRestoredSession = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const restoredUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(restoredUser);
        setStatus('authenticated');
        setError('');
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setUser(null);
        setStatus('unauthenticated');

        if (requestError instanceof ApiError && requestError.status === 401) {
          setError('');

          if (!PUBLIC_AUTH_PATHS.has(location.pathname)) {
            navigate('/login', { replace: true });
          }

          return;
        }

        setError(requestError.message || 'Could not restore session');
      }
    }

    if (!hasRestoredSession.current) {
      hasRestoredSession.current = true;
      restoreSession();
    }

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  const login = useCallback(
    async (values) => {
      setError('');
      const authenticatedUser = await loginUser(values);
      setUser(authenticatedUser);
      setStatus('authenticated');
      navigate('/dashboard', { replace: true });

      return authenticatedUser;
    },
    [navigate],
  );

  const register = useCallback(
    async (values) => {
      setError('');
      const authenticatedUser = await registerUser(values);
      setUser(authenticatedUser);
      setStatus('authenticated');
      navigate('/dashboard', { replace: true });

      return authenticatedUser;
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      error,
      isAuthenticated: status === 'authenticated',
      isRestoring: status === 'checking',
      login,
      logout,
      register,
      status,
      user,
    }),
    [error, login, logout, register, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
