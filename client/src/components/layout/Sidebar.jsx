import { NavLink } from 'react-router-dom';
import { mergeClassNames } from '../../lib/classNames.js';

export function Sidebar({ routes }) {
  return (
    <aside
      className="border border-primary/30 bg-gradient-to-b from-primary to-focus p-5 text-primary-text shadow-panel lg:rounded-[18px] lg:p-6"
      aria-label="Primary navigation"
    >
      <div className="mb-5 flex items-center gap-3 lg:mb-8">
        <span
          className="grid size-11 place-items-center rounded-ui bg-primary-text text-sm font-extrabold text-primary shadow-card"
          aria-hidden="true"
        >
          OS
        </span>
        <div>
          <p className="m-0 font-extrabold">Personal OS</p>
          <p className="mt-0.5 text-sm text-primary-text/75">V1 foundation</p>
        </div>
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-1">
        {routes.map((route) => (
          <NavLink
            className={({ isActive }) =>
              mergeClassNames(
                'rounded-ui border px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-text/30',
                isActive
                  ? 'border-primary-text bg-primary-text text-primary shadow-card'
                  : 'border-transparent text-primary-text/80 hover:bg-primary-text/15 hover:text-primary-text',
              )
            }
            key={route.path}
            to={route.path}
          >
            {route.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
