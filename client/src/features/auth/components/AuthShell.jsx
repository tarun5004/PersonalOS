import { Badge } from '../../../components/ui/Badge.jsx';
import { ThemeToggle } from '../../theme/ThemeToggle.jsx';

const previewRows = [
  { label: 'Plan today', value: 'Tasks' },
  { label: 'Keep rhythm', value: 'Habits' },
  { label: 'Review week', value: 'Analytics' },
];

export function AuthShell({ children, eyebrow, summary, title }) {
  return (
    <section className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,var(--theme-primary-soft),var(--theme-app-bg)_46%)] p-0 text-body sm:p-6">
      <div className="grid min-h-screen w-full overflow-hidden border border-border bg-surface shadow-panel sm:min-h-[min(720px,calc(100vh-48px))] sm:max-w-[1160px] sm:rounded-[18px] lg:grid-cols-[78px_minmax(0,1fr)]">
        <aside
          className="hidden flex-col items-center gap-5 bg-gradient-to-b from-primary to-focus px-4 py-6 lg:flex"
          aria-hidden="true"
        >
          <span className="grid size-10 place-items-center rounded-ui bg-primary-text text-sm font-extrabold text-primary">
            OS
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-primary-text shadow-card">
            <span className="size-2.5 rounded-full bg-primary" />
          </span>
          <span className="size-3 rounded-full bg-primary-text/45" />
          <span className="size-3 rounded-full bg-primary-text/45" />
          <span className="size-3 rounded-full bg-primary-text/45" />
        </aside>

        <div className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] px-5 py-6 sm:px-8 lg:py-7">
          <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span
                className="grid size-10 place-items-center rounded-ui bg-primary-soft text-sm font-extrabold text-primary-strong"
                aria-hidden="true"
              >
                OS
              </span>
              <div>
                <p className="m-0 font-extrabold">Personal OS</p>
                <p className="mt-0.5 text-sm text-muted">Daily productivity workspace</p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <div className="grid min-h-0 items-center gap-8 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,440px)] lg:gap-10 lg:pt-11">
            <div className="min-w-0">
              <Badge>{eyebrow}</Badge>
              <h1 className="mt-4 max-w-[640px] text-[clamp(2.45rem,6vw,4.9rem)] font-extrabold leading-[1.08] tracking-normal text-body">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">
                {summary}
              </p>

              <div
                className="mt-8 grid gap-4 xl:grid-cols-[minmax(220px,0.84fr)_minmax(230px,1fr)]"
                aria-hidden="true"
              >
                <div className="rounded-ui border border-border bg-surface p-5 shadow-card">
                  <p className="m-0 text-sm text-muted">Today</p>
                  <strong className="mt-2 block text-xl text-body">Build a calmer plan.</strong>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <span className="block h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-focus" />
                  </div>
                </div>

                <div className="grid rounded-ui border border-border bg-surface p-2 shadow-card">
                  {previewRows.map((row) => (
                    <div
                      className="flex items-center justify-between gap-3 border-b border-border px-3 py-3 last:border-b-0"
                      key={row.label}
                    >
                      <span className="text-sm text-muted">{row.label}</span>
                      <strong className="text-sm text-primary-strong">{row.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
