export function PageHeader({ description, eyebrow, title }) {
  return (
    <div className="page-header">
      {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
      <p className="page-title">{title}</p>
      {description ? <p className="page-description">{description}</p> : null}
    </div>
  );
}
