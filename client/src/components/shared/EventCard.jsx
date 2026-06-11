import { Badge } from '../ui/Badge.jsx';

export function EventCard({ label, meta, title }) {
  return (
    <article className="border-t border-dashed border-border pt-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-muted">{meta}</p>
          <h3 className="mt-1 text-sm font-extrabold text-body">{title}</h3>
        </div>
        <Badge variant="muted">{label}</Badge>
      </div>
    </article>
  );
}
