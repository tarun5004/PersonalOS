import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function ErrorState({ className, message, onRetry, title = 'Something went wrong' }) {
  return (
    <Card className={mergeClassNames('p-6', className)}>
      <div className="max-w-xl">
        <p className="m-0 text-sm font-semibold uppercase text-danger">Error</p>
        <h2 className="mt-2 text-xl font-bold text-body">{title}</h2>
        {message ? <p className="mt-2 text-sm leading-6 text-muted">{message}</p> : null}
        {onRetry ? (
          <Button className="mt-5" onClick={onRetry} variant="secondary">
            Try again
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
