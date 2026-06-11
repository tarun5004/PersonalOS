export function PageHeader({ description, eyebrow, title }) {
  return (
    <div className="min-w-0">
      {eyebrow ? (
        <p className="m-0 text-xs font-semibold uppercase text-primary-strong">
          {eyebrow}
        </p>
      ) : null}
      <p className="mt-1 text-lg font-bold text-body">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
    </div>
  );
}
