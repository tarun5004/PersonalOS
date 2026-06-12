import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function AppLayout({ routes }) {
  const navRoutes = routes.filter((route) => route.showInNav);

  return (
    <div className="h-screen overflow-hidden bg-app-bg p-0 text-body sm:p-4 lg:p-6">
      <a
        className="fixed left-3 top-3 z-20 -translate-y-[140%] rounded-card bg-accent px-3 py-2 text-sm font-bold text-accent-text transition focus:translate-y-0 focus:outline-none focus:shadow-focus"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="mx-auto grid h-full min-h-0 w-full max-w-[1280px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden border border-border bg-surface shadow-panel sm:rounded-panel lg:grid-cols-[240px_minmax(0,1fr)] lg:grid-rows-1">
        <Sidebar routes={navRoutes} />
        <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] bg-surface">
          <Topbar routes={navRoutes} />
          <main
            className="min-h-0 min-w-0 overflow-y-auto bg-surface px-4 pb-5 pt-4 sm:px-6 lg:px-8"
            id="main-content"
            tabIndex={-1}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
