import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ApiError,
  clearApiAccessToken,
  setApiAccessToken,
  setAuthRefreshHandler,
  setAuthUnauthorizedHandler,
} from '../../lib/apiClient.js';
import {
  loginUser,
  logoutUser,
  refreshAuthSession,
  registerUser,
  uploadAvatarImage,
} from './authApi.js';
import {
  readStoredAvatarId,
  resolveAvatarId,
  writeStoredAvatarId,
} from '../../utils/avatars.js';

const PUBLIC_AUTH_PATHS = new Set(['/login', '/register']);

export const AuthContext = createContext(null);

function withAvatarPreference(user) {
  if (!user) {
    return null;
  }

  const avatarId = resolveAvatarId(user.avatarId || readStoredAvatarId());
  writeStoredAvatarId(avatarId);

  return {
    ...user,
    avatarId,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');
  const hasRestoredSession = useRef(false);
  const refreshPromiseRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    clearApiAccessToken();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const applySession = useCallback((session) => {
    setApiAccessToken(session.accessToken);
    setUser(withAvatarPreference(session.user));
    setStatus('authenticated');
    setError('');
  }, []);

  const requestFreshSession = useCallback(() => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = refreshAuthSession().finally(() => {
        refreshPromiseRef.current = null;
      });
    }

    return refreshPromiseRef.current;
  }, []);

  const refreshSession = useCallback(async () => {
    const session = await requestFreshSession();
    applySession(session);

    return session.accessToken;
  }, [applySession, requestFreshSession]);

  useEffect(() => {
    setAuthRefreshHandler(refreshSession);
    setAuthUnauthorizedHandler(clearSession);

    return () => {
      setAuthRefreshHandler(null);
      setAuthUnauthorizedHandler(null);
    };
  }, [clearSession, refreshSession]);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (PUBLIC_AUTH_PATHS.has(location.pathname)) {
        clearSession();
        hasRestoredSession.current = true;
        return;
      }

      try {
        const restoredSession = await requestFreshSession();

        if (!isMounted) {
          return;
        }

        applySession(restoredSession);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        clearSession();

        if (requestError instanceof ApiError && requestError.status === 401) {
          setError('');

          if (!PUBLIC_AUTH_PATHS.has(location.pathname)) {
            navigate('/login', { replace: true });
          }

          return;
        }

        setError(requestError.message || 'Could not restore session');
      } finally {
        if (isMounted) {
          hasRestoredSession.current = true;
        }
      }
    }

    if (!hasRestoredSession.current) {
      restoreSession();
    }

    return () => {
      isMounted = false;
    };
  }, [applySession, clearSession, location.pathname, navigate, requestFreshSession]);

  const login = useCallback(
    async (values) => {
      setError('');
      const session = await loginUser(values);
      applySession(session);
      navigate('/dashboard', { replace: true });

      return session.user;
    },
    [applySession, navigate],
  );

  const register = useCallback(
    async (values) => {
      setError('');
      const session = await registerUser(values);
      applySession(session);
      navigate('/dashboard', { replace: true });

      return session.user;
    },
    [applySession, navigate],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  }, [clearSession, navigate]);

  const updateAvatarId = useCallback((avatarId) => {
    const nextAvatarId = resolveAvatarId(avatarId);
    writeStoredAvatarId(nextAvatarId);
    setUser((currentUser) =>
      currentUser
        ? {
            ...currentUser,
            avatarId: nextAvatarId,
          }
        : currentUser,
    );
  }, []);

  const uploadAvatar = useCallback(async (dataUrl) => {
    const nextUser = await uploadAvatarImage(dataUrl);
    setUser(withAvatarPreference(nextUser));

    return nextUser;
  }, []);

  const value = useMemo(
    () => ({
      error,
      isAuthenticated: status === 'authenticated',
      isRestoring: status === 'checking',
      login,
      logout,
      register,
      status,
      updateAvatarId,
      uploadAvatar,
      user,
    }),
    [error, login, logout, register, status, updateAvatarId, uploadAvatar, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
