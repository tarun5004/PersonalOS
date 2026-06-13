import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function Modal({ children, className, isOpen, onClose, title }) {
  return (
    <Dialog className="relative z-50" onClose={onClose || (() => {})} open={isOpen}>
      <div className="fixed inset-0 bg-body/45" aria-hidden="true" />
      <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
        <DialogPanel
          as={Card}
          className={mergeClassNames('w-full max-w-lg p-5 shadow-panel', className)}
        >
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="m-0 text-xl font-bold text-body">{title}</DialogTitle>
            {onClose ? (
              <Button aria-label="Close dialog" onClick={onClose} size="sm" variant="ghost">
                X
              </Button>
            ) : null}
          </div>
          <div className="mt-5">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
