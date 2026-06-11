import { NavLink } from 'react-router-dom';
import { mergeClassNames } from '../../lib/classNames.js';

const routeMarks = {
  Dashboard: 'D',
  Tasks: 'T',
  Habits: 'H',
  Analytics: 'A',
  Settings: 'S',
};

export function Sidebar({ routes }) {
  return (
    <aside
      className="flex items-center gap-4 bg-gradient-to-b from-primary to-focus p-5 text-primary-text lg:flex-col lg:gap-6 lg:px-4 lg:py-7"
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
          <p className="mt-0.5 text-sm text-primary-text/75">V1 foundation</p>
        </div>
      </div>

      <nav className="ml-auto flex flex-wrap items-center gap-2 lg:ml-0 lg:grid lg:gap-4">
        {routes.map((route) => (
          <NavLink
            aria-label={route.label}
            className={({ isActive }) =>
              mergeClassNames(
                'grid size-10 place-items-center rounded-ui border text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-text/30',
                isActive
                  ? 'border-primary-text bg-primary-text text-primary shadow-card'
                  : 'border-transparent bg-primary-text/10 text-primary-text/80 hover:bg-primary-text/20 hover:text-primary-text',
              )
            }
            key={route.path}
            title={route.label}
            to={route.path}
          >
            {routeMarks[route.label] || route.label.charAt(0)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
