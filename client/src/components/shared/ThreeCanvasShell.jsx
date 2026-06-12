import { Canvas } from '@react-three/fiber';
import { Box } from 'lucide-react';
import { mergeClassNames } from '../../lib/classNames.js';

/** Provides a bounded, token-aware container for optional lazy-loaded 3D scenes. */
export function ThreeCanvasShell({
  camera = { position: [0, 0, 5], fov: 45 },
  children,
  className,
  fallbackLabel = '3D progress scene',
  gl,
  showLabel = true,
  ...props
}) {
  return (
    <div
      className={mergeClassNames(
        'relative min-h-72 overflow-hidden rounded-panel border border-border bg-surface-elevated shadow-card',
        className,
      )}
      {...props}
    >
      {showLabel ? (
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-bold text-muted shadow-card">
          <Box aria-hidden="true" size={14} />
          {fallbackLabel}
        </div>
      ) : null}
      <Canvas camera={camera} dpr={[1, 1.5]} gl={gl}>
        <ambientLight intensity={0.7} />
        <directionalLight intensity={0.9} position={[3, 4, 5]} />
        {children}
      </Canvas>
    </div>
  );
}
