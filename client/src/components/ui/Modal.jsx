import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function Modal({ children, className, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-body/40 p-4">
      <Card
        aria-modal="true"
        className={mergeClassNames('w-full max-w-lg p-5 shadow-panel', className)}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="m-0 text-xl font-bold text-body">{title}</h2>
          {onClose ? (
            <Button aria-label="Close dialog" onClick={onClose} size="sm" variant="ghost">
              X
            </Button>
          ) : null}
        </div>
        <div className="mt-5">{children}</div>
      </Card>
    </div>
  );
}
