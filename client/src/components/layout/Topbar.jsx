import { matchPath, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth.js';
import { ThemeToggle } from '../../features/theme/ThemeToggle.jsx';
import { PageHeader } from './PageHeader.jsx';

function findActiveRoute(routes, pathname) {
  return routes.find((route) => matchPath({ end: true, path: route.path }, pathname));
}

export function Topbar({ routes }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const activeRoute = findActiveRoute(routes, location.pathname);
  const userLabel = user?.name ? `Signed in as ${user.name}` : 'Signed in';

  return (
    <header className="app-topbar">
      <PageHeader
        description={activeRoute?.description}
        eyebrow="Workspace"
        title={activeRoute?.label || 'Personal OS'}
      />

      <div className="topbar-actions">
        <span className="user-context">{userLabel}</span>
        <ThemeToggle compact />
        <button className="logout-button" onClick={logout} type="button">
          Log out
        </button>
      </div>
    </header>
  );
}
