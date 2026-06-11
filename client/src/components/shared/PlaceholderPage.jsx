import { Badge } from '../ui/Badge.jsx';
import { Card } from '../ui/Card.jsx';

export function PlaceholderPage({ children, eyebrow, title, summary, sections = [] }) {
  return (
    <section className="max-w-[1100px]">
      <Badge>{eyebrow}</Badge>
      <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.35rem)] font-extrabold leading-[1.08] tracking-normal text-body">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
        {summary}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}

      {sections.length > 0 ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {sections.map((section) => (
            <Card
              as="article"
              className="min-h-36 bg-[linear-gradient(135deg,var(--theme-surface),var(--theme-primary-soft))] p-5"
              key={section.title}
            >
              <p className="m-0 text-sm font-bold text-muted">{section.kicker}</p>
              <h2 className="mt-2 text-lg font-extrabold text-body">{section.title}</h2>
              <div className="mt-6 h-2 rounded-full bg-surface-muted">
                <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-focus" />
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </section>
  );
}
