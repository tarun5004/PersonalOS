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
      className="sidebar-gradient flex items-center gap-4 p-5 text-primary-text shadow-[var(--shadow-sidebar)] lg:flex-col lg:gap-6 lg:px-4 lg:py-7"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-3 lg:flex-col">
        <span
          className="grid size-11 place-items-center rounded-ui bg-primary-text text-sm font-extrabold text-primary shadow-card"
          aria-hidden="true"
        >
          OS
        </span>
        <div className="lg:hidden">
          <p className="m-0 font-extrabold">Personal OS</p>
          <p className="mt-0.5 text-sm text-primary-text/75">Daily workspace</p>
        </div>
      </div>

      <nav className="ml-auto flex flex-wrap items-center gap-2 lg:ml-0 lg:grid lg:gap-4">
        {routes.map((route) => {
          const Icon = routeIcons[route.label] || Home;

          return (
            <NavLink
              aria-label={route.label}
              className={({ isActive }) =>
                mergeClassNames(
                  'group relative grid size-11 place-items-center rounded-ui border transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-text/30',
                  isActive
                    ? 'border-primary-text/30 bg-primary-text/25 text-primary-text shadow-card'
                    : 'border-transparent bg-primary-text/10 text-primary-text/70 hover:bg-primary-text/15 hover:text-primary-text',
                )
              }
              key={route.path}
              title={route.label}
              to={route.path}
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
                  {isActive ? (
                    <span className="absolute right-1.5 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-full bg-primary-text lg:block" />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden flex-1 lg:block" />

      <div className="hidden items-center gap-3 lg:flex lg:flex-col">
        <span className="relative grid size-11 place-items-center rounded-ui bg-primary-text/20 text-sm font-extrabold text-primary-text">
          {initials}
          <span className="absolute bottom-1 right-1 size-2.5 rounded-full border border-primary-text bg-success" />
        </span>
        <button
          aria-label="Log out"
          className="grid size-10 place-items-center rounded-ui border border-transparent bg-primary-text/10 text-primary-text/75 transition hover:bg-primary-text/15 hover:text-primary-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-text/30"
          onClick={logout}
          title="Log out"
          type="button"
        >
          <LogOut aria-hidden="true" size={18} />
        </button>
      </div>
    </aside>
  );
}
