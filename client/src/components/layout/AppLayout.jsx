import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import './AppLayout.css';

export function AppLayout({ routes }) {
  const navRoutes = routes.filter((route) => route.showInNav);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar routes={navRoutes} />
      <div className="app-content">
        <Topbar routes={navRoutes} />
        <main className="app-main" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
