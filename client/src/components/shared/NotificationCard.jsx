import { Badge } from '../ui/Badge.jsx';

export function NotificationCard({ badge = 'Today', detail, title }) {
  return (
    <article className="rounded-card border border-border bg-surface p-4 transition hover:border-accent">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-body">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
        </div>
        <Badge variant="success">{badge}</Badge>
      </div>
    </article>
  );
}
