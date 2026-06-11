import './PlaceholderPage.css';

export function PlaceholderPage({ eyebrow, title, summary, sections = [] }) {
  return (
    <section className="placeholder-page">
      <p className="placeholder-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="placeholder-summary">{summary}</p>

      {sections.length > 0 ? (
        <div className="placeholder-grid">
          {sections.map((section) => (
            <article className="placeholder-card" key={section.title}>
              <p>{section.kicker}</p>
              <h2>{section.title}</h2>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

