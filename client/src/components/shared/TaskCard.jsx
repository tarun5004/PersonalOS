import { Badge } from '../ui/Badge.jsx';

export function TaskCard({ due, progress, tag, title }) {
  const boundedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <article className="grid gap-3 rounded-ui bg-surface px-4 py-3 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-body">{title}</h3>
          <p className="mt-1 text-xs text-muted">{due}</p>
        </div>
        <Badge variant="primary">{tag}</Badge>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-surface-muted">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-primary to-focus"
            style={{ width: `${boundedProgress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-muted">{progress}%</span>
      </div>
    </article>
  );
}
