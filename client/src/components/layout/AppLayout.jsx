import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function AppLayout({ routes }) {
  const navRoutes = routes.filter((route) => route.showInNav);

  return (
    <div className="grid min-h-screen gap-0 bg-[linear-gradient(135deg,var(--theme-primary-soft),var(--theme-app-bg)_52%)] p-0 text-body lg:grid-cols-[238px_minmax(0,1fr)] lg:gap-5 lg:p-5">
      <a
        className="fixed left-3 top-3 z-20 -translate-y-[140%] rounded-ui bg-primary px-3 py-2 text-sm font-bold text-primary-text transition focus:translate-y-0 focus:outline-none focus:ring-[3px] focus:ring-focus/35"
        href="#main-content"
      >
        Skip to content
      </a>
      <Sidebar routes={navRoutes} />
      <div className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden border border-border bg-surface shadow-panel lg:rounded-[18px]">
        <Topbar routes={navRoutes} />
        <main className="min-w-0 p-5 sm:p-8" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
