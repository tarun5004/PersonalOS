import { Badge } from '../ui/Badge.jsx';

export function EventCard({ icon: Icon, label, meta, title }) {
  return (
    <article className="border-t border-dashed border-border pt-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          {Icon ? (
            <span className="grid size-9 shrink-0 place-items-center rounded-ui bg-primary-soft text-primary-strong">
              <Icon aria-hidden="true" size={17} />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted">{meta}</p>
            <h3 className="mt-1 text-sm font-bold text-body">{title}</h3>
          </div>
        </div>
        <Badge variant="muted">{label}</Badge>
      </div>
    </article>
  );
}
