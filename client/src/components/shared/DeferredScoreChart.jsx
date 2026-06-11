import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Loader } from '../ui/Loader.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

const LazyScoreChart = lazy(() =>
  import('./ScoreChart.jsx').then((module) => ({ default: module.ScoreChart })),
);

function ChartPlaceholder({ label = 'Chart loads when visible' }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-ui border border-dashed border-border bg-surface-muted/60 p-6 text-center">
      <div className="grid justify-items-center gap-3">
        <span className="grid size-11 place-items-center rounded-ui bg-primary-soft text-primary-strong">
          <BarChart3 aria-hidden="true" size={19} />
        </span>
        <Loader label={label} />
      </div>
    </div>
  );
}

export function DeferredScoreChart({ className, rootMargin = '180px', ...props }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasStableSize, setHasStableSize] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      return undefined;
    }

    const node = containerRef.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) {
      setHasStableSize(false);
      return undefined;
    }

    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    function syncSize() {
      setHasStableSize(node.clientWidth > 0 && node.clientHeight > 0);
    }

    syncSize();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(syncSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div className={mergeClassNames('min-h-64 min-w-0 w-full', className)} ref={containerRef}>
      {shouldLoad && hasStableSize ? (
        <Suspense fallback={<ChartPlaceholder label="Preparing chart..." />}>
          <LazyScoreChart {...props} />
        </Suspense>
      ) : (
        <ChartPlaceholder />
      )}
    </div>
  );
}
