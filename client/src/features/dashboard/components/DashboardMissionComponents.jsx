import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';

/** Renders a dismissible dashboard attention alert. */
export function UrgentAlert({ alert, onDismiss }) {
  const Icon = alert.icon;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={mergeClassNames(
        'grid gap-3 rounded-card border bg-surface px-4 py-3 shadow-card sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center',
        alert.variant === 'danger' && 'border-danger/40 bg-[var(--danger-subtle)]',
        alert.variant === 'warning' && 'border-warning/40 bg-[var(--warning-subtle)]',
        alert.variant === 'primary' && 'border-accent/40 bg-accent-soft',
      )}
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: -8 }}
      layout
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <span
        className={mergeClassNames(
          'grid size-10 place-items-center rounded-card',
          alert.variant === 'danger' && 'text-danger',
          alert.variant === 'warning' && 'text-warning',
          alert.variant === 'primary' && 'text-accent',
        )}
      >
        <Icon aria-hidden="true" size={20} />
      </span>
      <div className="min-w-0">
        <p className="m-0 text-sm font-bold text-body">{alert.title}</p>
        <p className="mt-1 text-sm text-muted">{alert.detail}</p>
      </div>
      {alert.action}
      <button
        aria-label={`Dismiss ${alert.title}`}
        className="grid size-9 place-items-center rounded-card text-muted transition hover:bg-surface hover:text-body focus-visible:outline-none focus-visible:shadow-focus"
        onClick={() => onDismiss(alert.id)}
        type="button"
      >
        <X aria-hidden="true" size={16} />
      </button>
    </motion.div>
  );
}

/** Renders a linked next-action row on the dashboard. */
export function ActionRow({ action, detail, icon: Icon, title, to }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      <Link
        className="group grid gap-3 rounded-card border border-border bg-surface px-4 py-3 transition hover:border-accent hover:bg-accent-soft sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
        to={to}
      >
        <span className="grid size-10 place-items-center rounded-card bg-accent-soft text-accent-strong">
          <Icon aria-hidden="true" size={18} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-body">{title}</span>
          <span className="mt-0.5 block text-xs leading-5 text-muted">{detail}</span>
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-strong">
          {action}
          <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-0.5" size={15} />
        </span>
      </Link>
    </motion.div>
  );
}

/** Renders a dashboard quick-action link button. */
export function QuickAction({ icon: Icon, label, to }) {
  return (
    <Button as={Link} className="justify-between" to={to} variant="secondary">
      <span className="inline-flex items-center gap-2">
        <Icon aria-hidden="true" size={17} />
        {label}
      </span>
      <ArrowRight aria-hidden="true" size={16} />
    </Button>
  );
}

/** Renders a small dashboard summary metric row. */
export function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-card border border-border bg-surface-elevated px-4 py-3">
      <span className="text-sm font-semibold text-muted">{label}</span>
      <span className="text-sm font-bold text-body">{value}</span>
    </div>
  );
}

/** Renders the compact seven-day habit-status calendar. */
export function WeekCalendar({ days }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div className="grid justify-items-center gap-2 text-center" key={day.key}>
          <span className="text-xs font-semibold uppercase text-muted">{day.label}</span>
          <span
            className={mergeClassNames(
              'grid size-9 place-items-center rounded-full text-sm font-bold',
              day.isToday ? 'bg-accent text-accent-text' : 'bg-surface-elevated text-body',
            )}
          >
            {day.date.getDate()}
          </span>
          <span
            aria-label={
              day.status === 'done'
                ? 'All habits done'
                : day.status === 'missed'
                  ? 'Habit missed'
                  : 'No habit data'
            }
            className={mergeClassNames(
              'size-2 rounded-full',
              day.status === 'done' && 'bg-success',
              day.status === 'missed' && 'bg-danger',
              day.status === 'none' && 'bg-transparent',
            )}
          />
        </div>
      ))}
    </div>
  );
}
