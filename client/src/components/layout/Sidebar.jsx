import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  CheckSquare,
  Home,
  LogOut,
  RefreshCcwDot,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth.js';
import { mergeClassNames } from '../../lib/classNames.js';

const routeIcons = {
  Dashboard: Home,
  Tasks: CheckSquare,
  Habits: RefreshCcwDot,
  Analytics: BarChart3,
  Settings,
};

export function Sidebar({ routes }) {
  const { logout, user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'OS';

  return (
    <aside
      className="sidebar-gradient flex items-center gap-4 p-5 text-sidebar-text shadow-[var(--shadow-sidebar)] lg:flex-col lg:items-stretch lg:gap-6 lg:px-4 lg:py-6"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-3">
        <span
          className="grid size-10 place-items-center rounded-ui bg-sidebar-text text-sm font-bold text-primary shadow-card"
          aria-hidden="true"
        >
          OS
        </span>
        <div>
          <p className="m-0 font-bold">Personal OS</p>
          <p className="mt-0.5 text-sm text-sidebar-muted">Command center</p>
        </div>
      </div>

      <nav className="ml-auto flex flex-wrap items-center gap-2 lg:ml-0 lg:grid lg:gap-2">
        {routes.map((route) => {
          const Icon = routeIcons[route.label] || Home;

          return (
            <NavLink
              aria-label={route.label}
              className={({ isActive }) =>
                mergeClassNames(
                  'group relative flex min-h-11 items-center justify-center gap-3 rounded-ui border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-text/25 lg:justify-start',
                  isActive
                    ? 'border-sidebar-text/20 bg-sidebar-text/15 text-sidebar-text shadow-card'
                    : 'border-transparent text-sidebar-muted hover:bg-sidebar-text/10 hover:text-sidebar-text',
                )
              }
              key={route.path}
              title={route.label}
              to={route.path}
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
                  <span className="hidden lg:inline">{route.label}</span>
                  {isActive ? (
                    <span className="absolute left-1 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-full bg-primary lg:block" />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden flex-1 lg:block" />

      <div className="hidden gap-3 lg:grid">
        <div className="flex items-center gap-3 rounded-ui border border-sidebar-text/15 bg-sidebar-text/10 p-3">
          <span className="relative grid size-10 place-items-center rounded-ui bg-sidebar-text/15 text-sm font-bold text-sidebar-text">
            {initials}
            <span className="absolute bottom-1 right-1 size-2.5 rounded-full border border-sidebar-text/20 bg-success" />
          </span>
          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-semibold text-sidebar-text">{user?.name || 'Workspace'}</p>
            <p className="mt-0.5 text-xs text-sidebar-muted">Active session</p>
          </div>
        </div>
        <button
          aria-label="Log out"
          className="flex min-h-10 items-center justify-center gap-2 rounded-ui border border-transparent bg-sidebar-text/10 px-3 text-sm font-semibold text-sidebar-muted transition hover:bg-sidebar-text/15 hover:text-sidebar-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-text/25"
          onClick={logout}
          title="Log out"
          type="button"
        >
          <LogOut aria-hidden="true" size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
