import { DashboardCard } from './DashboardCard.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function StatCard({ className, icon: Icon, label, tone = 'primary', value, helper }) {
  const toneClassName =
    tone === 'success'
      ? 'from-success to-focus'
      : tone === 'warning'
        ? 'from-warning to-primary'
        : 'from-primary to-focus';

  return (
    <DashboardCard className={mergeClassNames('p-4', className)}>
      <div className="flex items-center gap-4">
        <div
          className={mergeClassNames(
            'grid size-12 shrink-0 place-items-center rounded-ui bg-gradient-to-br text-sm font-extrabold text-primary-text shadow-card',
            toneClassName,
          )}
        >
          {Icon ? <Icon aria-hidden="true" size={20} /> : value}
        </div>
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase text-muted">{label}</p>
          <p className="mt-1 text-xl font-extrabold text-body">{value}</p>
          {helper ? <p className="mt-1 text-xs text-muted">{helper}</p> : null}
        </div>
      </div>
    </DashboardCard>
  );
}
