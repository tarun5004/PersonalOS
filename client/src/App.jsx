import { Suspense } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { appRoutes } from './app/routes/routeConfig.js';
import { RouteLoading } from './app/routes/RouteLoading.jsx';
import { NotFoundPage } from './features/system/pages/NotFoundPage.jsx';
import './App.css';

function App() {
  const navRoutes = appRoutes.filter((route) => route.showInNav);

  return (
    <div className="app-shell">
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
          {navRoutes.map((route) => (
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

      <main className="app-main">
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route element={<Navigate replace to="/dashboard" />} path="/" />
            {appRoutes.map((route) => (
              <Route element={<route.Component />} key={route.path} path={route.path} />
            ))}
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

