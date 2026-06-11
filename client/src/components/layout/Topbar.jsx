import { matchPath, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
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
    <header className="flex min-h-[88px] flex-col items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:gap-6">
      <PageHeader
        description={activeRoute?.description}
        eyebrow="Workspace"
        title={activeRoute?.label || 'Personal OS'}
      />

      <div className="flex w-full flex-wrap items-center justify-start gap-3 lg:w-auto lg:justify-end">
        <Badge className="normal-case" variant="muted">
          {userLabel}
        </Badge>
        <ThemeToggle compact />
        <Button onClick={logout} size="sm" variant="secondary">
          Log out
        </Button>
      </div>
    </header>
  );
}
