import { DashboardCard } from './DashboardCard.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function StatCard({ className, icon: Icon, label, tone = 'primary', value, helper }) {
  const toneClassName =
    tone === 'success'
      ? 'bg-success/10 text-success'
      : tone === 'warning'
        ? 'bg-warning/10 text-warning'
        : tone === 'danger'
          ? 'bg-danger/10 text-danger'
          : 'bg-accent-soft text-accent-strong';

  return (
    <DashboardCard className={mergeClassNames('p-4', className)}>
      <div className="flex items-center gap-4">
        <div
          className={mergeClassNames(
            'grid size-12 shrink-0 place-items-center rounded-card text-sm font-bold',
            toneClassName,
          )}
        >
          {Icon ? <Icon aria-hidden="true" size={20} /> : value}
        </div>
        <div className="min-w-0">
          <p className="m-0 text-xs font-semibold uppercase text-muted">{label}</p>
          <p className="mt-1 text-xl font-bold text-body">{value}</p>
          {helper ? <p className="mt-1 text-xs text-muted">{helper}</p> : null}
        </div>
      </div>
    </DashboardCard>
  );
}
