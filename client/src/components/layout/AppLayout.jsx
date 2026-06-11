import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function AppLayout({ routes }) {
  const navRoutes = routes.filter((route) => route.showInNav);

  return (
    <div className="min-h-screen bg-app-bg p-0 text-body sm:p-5 lg:p-8">
      <a
        className="fixed left-3 top-3 z-20 -translate-y-[140%] rounded-ui bg-primary px-3 py-2 text-sm font-bold text-primary-text transition focus:translate-y-0 focus:outline-none focus:ring-[3px] focus:ring-focus/35"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="mx-auto grid min-h-screen w-full max-w-[1240px] overflow-hidden border border-border bg-surface shadow-panel sm:min-h-[calc(100vh-40px)] sm:rounded-[28px] lg:min-h-[calc(100vh-64px)] lg:grid-cols-[84px_minmax(0,1fr)]">
        <Sidebar routes={navRoutes} />
        <div className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] bg-surface">
          <Topbar routes={navRoutes} />
          <main className="min-w-0 bg-surface px-5 pb-6 pt-4 sm:px-8 lg:px-9" id="main-content" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
