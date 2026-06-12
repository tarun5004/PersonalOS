import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  CheckSquare,
  Home,
  LogOut,
  RefreshCcwDot,
  Settings,
} from 'lucide-react';
import { AvatarDisplay } from '../shared/AvatarDisplay.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { mergeClassNames } from '../../lib/classNames.js';

const routeIcons = {
  Dashboard: Home,
  Tasks: CheckSquare,
  Habits: RefreshCcwDot,
  Analytics: BarChart3,
  Settings,
};

function SidebarLink({ route }) {
  const Icon = routeIcons[route.label] || Home;

  return (
    <NavLink
      aria-label={route.label}
      className={({ isActive }) =>
        mergeClassNames(
          'group relative flex min-h-10 shrink-0 items-center justify-center gap-3 rounded-card border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:shadow-focus lg:justify-start',
          isActive
            ? 'border-[var(--sidebar-border)] bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]'
            : 'border-transparent text-sidebar-muted hover:bg-[var(--sidebar-hover)] hover:text-sidebar-text',
        )
      }
      title={route.label}
      to={route.path}
    >
      {({ isActive }) => (
        <>
          <span
            className={mergeClassNames(
              'absolute left-0 top-2 hidden h-6 w-0.5 rounded-full bg-accent opacity-0 transition lg:block',
              isActive && 'opacity-100',
            )}
          />
          <Icon aria-hidden="true" size={18} strokeWidth={2.2} />
          <span className="hidden lg:inline">{route.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ routes }) {
  const { logout, user } = useAuth();
  const primaryRoutes = routes.filter((route) => route.label !== 'Settings');
  const systemRoutes = routes.filter((route) => route.label === 'Settings');
  const userLabel = user?.name || 'Personal workspace';
  const userMeta = user?.email || 'Daily command center';

  return (
    <aside
      className="app-rail flex shrink-0 items-center gap-3 border-b p-3 text-sidebar-text sm:p-4 lg:h-full lg:min-h-0 lg:flex-col lg:items-stretch lg:gap-5 lg:border-b-0 lg:border-r lg:px-4 lg:py-5"
      aria-label="Primary navigation"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="grid size-10 place-items-center rounded-card border border-[var(--sidebar-border)] bg-surface text-sm font-semibold text-[var(--sidebar-active-text)]"
          aria-hidden="true"
        >
          OS
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-text">Personal OS</p>
          <p className="mt-0.5 truncate text-xs text-sidebar-muted">Command center</p>
        </div>
      </div>

      <nav className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto lg:ml-0 lg:grid lg:gap-5 lg:overflow-visible">
        <div className="contents lg:grid lg:gap-2">
          <p className="hidden px-3 text-xs font-semibold uppercase tracking-[0.05em] text-sidebar-muted lg:block">
            Workspace
          </p>
          <div className="contents lg:grid lg:gap-1">
            {primaryRoutes.map((route) => (
              <SidebarLink key={route.path} route={route} />
            ))}
          </div>
        </div>

        {systemRoutes.length ? (
          <div className="contents lg:grid lg:gap-2">
            <p className="hidden px-3 text-xs font-semibold uppercase tracking-[0.05em] text-sidebar-muted lg:block">
              System
            </p>
            <div className="contents lg:grid lg:gap-1">
              {systemRoutes.map((route) => (
                <SidebarLink key={route.path} route={route} />
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      <div className="hidden flex-1 lg:block" />

      <div className="hidden gap-3 lg:grid">
        <div className="flex items-center gap-3 border-t border-[var(--sidebar-border)] pt-4">
          <AvatarDisplay avatarId={user?.avatarId} label={`${userLabel} avatar`} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-text">{userLabel}</p>
            <p className="mt-0.5 truncate text-xs text-sidebar-muted">{userMeta}</p>
          </div>
        </div>
        <button
          aria-label="Log out"
          className="flex min-h-10 items-center justify-center gap-2 rounded-card border border-[var(--sidebar-border)] bg-transparent px-3 text-sm font-medium text-sidebar-muted transition hover:bg-[var(--sidebar-hover)] hover:text-sidebar-text focus-visible:outline-none focus-visible:shadow-focus"
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
