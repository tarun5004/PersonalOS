import {
  AlertTriangle,
  Clock,
  Flame,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ANALYTICS_UNLOCK_DAYS } from '../analyticsUtils.js';

const ICONS_BY_TYPE = {
  focus: Clock,
  'habit-risk': AlertTriangle,
  milestone: Flame,
  momentum: TrendingUp,
  recovery: Target,
  'strong-day': TrendingUp,
  'weak-day': AlertTriangle,
};

const TONE_CLASS_NAMES = {
  danger: 'border-l-danger bg-[var(--danger-subtle)] text-[var(--danger-text)]',
  success: 'border-l-success bg-[var(--success-subtle)] text-[var(--success-text)]',
  warning: 'border-l-warning bg-[var(--warning-subtle)] text-[var(--warning-text)]',
};

export function InsightFeed({ insights, unlockProgress }) {
  if (insights.length === 0) {
    const progress = Math.min(ANALYTICS_UNLOCK_DAYS, unlockProgress);

    return (
      <EmptyState
        className="min-h-72 border border-dashed border-border bg-surface-elevated/70"
        description={`${progress} of ${ANALYTICS_UNLOCK_DAYS} days tracked`}
        framed={false}
        icon={Clock}
        title="Insights unlock after 7 days of tracking."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {insights.map((insight) => {
        const Icon = ICONS_BY_TYPE[insight.type] || Lightbulb;

        return (
          <article
            className={`rounded-card border border-l-[3px] border-border p-4 ${TONE_CLASS_NAMES[insight.tone] || TONE_CLASS_NAMES.success}`}
            key={`${insight.type}-${insight.headline}`}
          >
            <div className="flex gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-card bg-surface">
                <Icon aria-hidden="true" size={18} />
              </span>
              <div>
                <h3 className="m-0 text-base font-semibold text-body">{insight.headline}</h3>
                <p className="mt-1 text-sm text-muted">{insight.detail}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
