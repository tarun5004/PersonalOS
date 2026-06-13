import { motion } from 'framer-motion';
import { Badge } from '../../../components/ui/Badge.jsx';
import { ThemeToggle } from '../../theme/ThemeToggle.jsx';
import { BrandMark } from '../../../components/brand/BrandMark.jsx';

const previewRows = [
  { label: 'Tasks', value: 'Daily focus' },
  { label: 'Habits', value: 'Consistent rhythm' },
  { label: 'Analytics', value: 'Weekly review' },
];

export function AuthShell({ children, eyebrow, summary, title }) {
  return (
    <section className="auth-page grid min-h-dvh place-items-center overflow-y-auto p-4 text-body sm:p-6">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="auth-frame grid min-h-[calc(100dvh-2rem)] w-full overflow-hidden border border-border bg-surface shadow-panel sm:min-h-[min(720px,calc(100dvh-48px))] sm:max-w-[1160px] sm:rounded-panel lg:grid-cols-[minmax(320px,0.9fr)_minmax(360px,1fr)]"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          className="auth-visual-panel app-rail relative hidden min-h-0 flex-col justify-between overflow-hidden p-8 text-sidebar-text lg:flex"
          initial={{ opacity: 0, x: -18 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <div className="auth-orb auth-orb-one" />
          <div className="auth-orb auth-orb-two" />
          <div>
            <BrandMark
              iconClassName="size-12 border-sidebar-text/15 bg-sidebar-text text-[var(--sidebar-bg)]"
            />
            <motion.h2
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-xs text-[clamp(2rem,3vw,2.75rem)] font-bold leading-tight text-sidebar-text"
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.22, duration: 0.45 }}
            >
              Your personal command center, calmly organized.
            </motion.h2>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-w-sm text-sm leading-6 text-sidebar-muted"
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Tasks, habits, and weekly signals stay in one focused place.
            </motion.p>
          </div>

          <div className="grid gap-3">
            {previewRows.map((row, index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="auth-preview-row app-rail-surface flex items-center justify-between rounded-card border border-sidebar-text/15 px-4 py-3"
                initial={{ opacity: 0, x: -12 }}
                key={row.label}
                transition={{ delay: 0.36 + index * 0.08, duration: 0.35 }}
              >
                <span className="text-sm font-semibold text-sidebar-muted">{row.label}</span>
                <strong className="text-sm text-sidebar-text">{row.value}</strong>
              </motion.div>
            ))}
          </div>
        </motion.aside>

        <div className="auth-content-panel grid min-w-0 grid-rows-[auto_minmax(0,1fr)] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark iconClassName="bg-accent-soft text-accent-strong" />
              <div>
                <p className="m-0 font-bold">Personal OS</p>
                <p className="mt-0.5 text-sm text-muted">Daily productivity workspace</p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <div className="grid min-h-0 place-items-center py-8 lg:py-10">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[520px]"
              initial={{ opacity: 0, y: 14 }}
              transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge className="auth-eyebrow">{eyebrow}</Badge>
              <h1 className="mt-4 max-w-[520px] text-[clamp(1.85rem,5vw,3.1rem)] font-bold leading-[1.08] tracking-normal text-body">
                {title}
              </h1>
              <p className="mt-4 max-w-[500px] text-base leading-7 text-muted">
                {summary}
              </p>
              <div className="mt-7">{children}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
