import { NavLink } from 'react-router-dom';

export function Sidebar({ routes }) {
  return (
    <aside className="app-sidebar" aria-label="Primary navigation">
      <div className="brand-block">
        <span className="brand-mark" aria-hidden="true">
          OS
        </span>
        <div>
          <p className="brand-label">Personal OS</p>
          <p className="brand-subtitle">V1 foundation</p>
        </div>
      </div>

      <nav className="nav-list">
        {routes.map((route) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
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
