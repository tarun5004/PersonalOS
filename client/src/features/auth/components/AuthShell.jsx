import { Badge } from '../../../components/ui/Badge.jsx';
import { ThemeToggle } from '../../theme/ThemeToggle.jsx';

const previewRows = [
  { label: 'Tasks', value: 'Daily focus' },
  { label: 'Habits', value: 'Consistent rhythm' },
  { label: 'Analytics', value: 'Weekly review' },
];

export function AuthShell({ children, eyebrow, summary, title }) {
  return (
    <section className="grid min-h-screen place-items-center bg-app-bg p-0 text-body sm:p-6">
      <div className="grid min-h-screen w-full overflow-hidden border border-border bg-surface shadow-panel sm:min-h-[min(720px,calc(100vh-48px))] sm:max-w-[1160px] sm:rounded-panel lg:grid-cols-[minmax(320px,0.9fr)_minmax(360px,1fr)]">
        <aside
          className="app-rail hidden min-h-0 flex-col justify-between p-8 text-sidebar-text lg:flex"
          aria-hidden="true"
        >
          <div>
            <span className="grid size-12 place-items-center rounded-card bg-sidebar-text text-sm font-bold text-accent shadow-card">
              OS
            </span>
            <h2 className="mt-8 max-w-xs text-4xl font-bold leading-tight">
              Your personal command center, calmly organized.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-sidebar-muted">
              Tasks, habits, and weekly signals stay in one focused place.
            </p>
          </div>

          <div className="grid gap-3">
            {previewRows.map((row) => (
              <div
                className="app-rail-surface flex items-center justify-between rounded-card border border-sidebar-text/15 px-4 py-3"
                key={row.label}
              >
                <span className="text-sm font-semibold text-sidebar-muted">{row.label}</span>
                <strong className="text-sm text-sidebar-text">{row.value}</strong>
              </div>
            ))}
          </div>
        </aside>

        <div className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span
                className="grid size-10 place-items-center rounded-card bg-accent-soft text-sm font-bold text-accent-strong"
                aria-hidden="true"
              >
                OS
              </span>
              <div>
              <p className="m-0 font-bold">Personal OS</p>
              <p className="mt-0.5 text-sm text-muted">Daily productivity workspace</p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <div className="grid min-h-0 place-items-center pt-8 lg:pt-10">
            <div className="w-full max-w-[520px]">
              <Badge>{eyebrow}</Badge>
              <h1 className="mt-4 max-w-[520px] text-[clamp(2.05rem,4vw,3.1rem)] font-bold leading-[1.08] tracking-normal text-body">
                {title}
              </h1>
              <p className="mt-4 max-w-[500px] text-base leading-7 text-muted">
                {summary}
              </p>
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
