import Lottie from 'lottie-react';
import { Sparkles } from 'lucide-react';
import { mergeClassNames } from '../../lib/classNames.js';

/** Shows an optional Lottie visual with a static fallback for accessible state panels. */
export function LottieState({
  action,
  animationData,
  className,
  description,
  icon: Icon = Sparkles,
  title,
}) {
  return (
    <div className={mergeClassNames('grid place-items-center rounded-card border border-border bg-surface p-8 text-center shadow-card', className)}>
      <div className="max-w-sm">
        <div className="mx-auto mb-4 grid size-20 place-items-center rounded-panel bg-accent-soft text-accent-strong">
          {animationData ? (
            <Lottie animationData={animationData} aria-hidden="true" className="size-16" loop />
          ) : (
            <Icon aria-hidden="true" size={26} />
          )}
        </div>
        <h2 className="m-0 text-lg font-bold text-body">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
