import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { ThemeToggle } from '../../features/theme/ThemeToggle.jsx';
import { PageHeader } from './PageHeader.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

function findActiveRoute(routes, pathname) {
  return routes.find((route) => matchPath({ end: true, path: route.path }, pathname));
}

export function Topbar({ routes }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const activeRoute = findActiveRoute(routes, location.pathname);
  const userLabel = user?.name ? `Signed in as ${user.name}` : 'Signed in';

  return (
    <header className="grid gap-4 bg-surface px-5 py-5 sm:px-8 lg:px-9">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <PageHeader
            description={activeRoute?.description}
            eyebrow="Workspace"
            title={activeRoute?.label || 'Personal OS'}
          />
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Top navigation">
            {routes.slice(0, 4).map((route) => (
              <NavLink
                className={({ isActive }) =>
                  mergeClassNames(
                    'text-sm font-extrabold text-muted transition hover:text-body',
                    isActive && 'text-body underline decoration-primary decoration-2 underline-offset-4',
                  )
                }
                key={route.path}
                to={route.path}
              >
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex w-full flex-wrap items-center justify-start gap-3 lg:w-auto lg:justify-end">
          <Badge className="normal-case" variant="muted">
            {userLabel}
          </Badge>
          <ThemeToggle compact />
          <Button onClick={logout} size="sm" variant="dark">
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
