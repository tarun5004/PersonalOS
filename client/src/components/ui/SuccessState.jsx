import { Card } from './Card.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function SuccessState({ className, description, title }) {
  return (
    <Card className={mergeClassNames('border-success/35 bg-success/10 p-5', className)}>
      <p className="m-0 text-sm font-extrabold uppercase text-success">Success</p>
      <h2 className="mt-2 text-lg font-extrabold text-body">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
    </Card>
  );
}
