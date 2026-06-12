import { matchPath, useLocation } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { PomodoroWidget } from '../../features/pomodoro/components/PomodoroWidget.jsx';
import { ThemeToggle } from '../../features/theme/ThemeToggle.jsx';
import { PageHeader } from './PageHeader.jsx';

function findActiveRoute(routes, pathname) {
  return routes.find((route) => matchPath({ end: true, path: route.path }, pathname));
}

export function Topbar({ routes }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const activeRoute = findActiveRoute(routes, location.pathname);
  const userLabel = user?.name || 'Personal session';

  return (
    <header className="z-10 shrink-0 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          description={activeRoute?.description}
          eyebrow="Current workspace"
          title={activeRoute?.label || 'Personal OS'}
        />

        <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
          <PomodoroWidget />
          <ThemeToggle compact />
          <div className="hidden min-h-9 max-w-48 items-center gap-2 rounded-card border border-border bg-surface-elevated px-3 text-sm font-medium text-muted sm:inline-flex">
            <UserCircle aria-hidden="true" size={16} />
            <span className="truncate">{userLabel}</span>
          </div>
          <Button className="lg:hidden" onClick={logout} size="sm" variant="ghost">
            <LogOut aria-hidden="true" size={16} />
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
