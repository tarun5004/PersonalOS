import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeCanvasShell } from '../../../components/shared/ThreeCanvasShell.jsx';
import { POMODORO_STATUS } from '../../../utils/constants.js';

const FOCUS_CANVAS_GL = {
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true,
};

function clampProgress(progress) {
  return Math.min(Math.max(Number(progress) || 0, 0), 1);
}

function readCssVariable(name, fallback = 'white') {
  if (typeof window === 'undefined') {
    return fallback;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function getActiveToken(status) {
  if (status === POMODORO_STATUS.FOCUS) {
    return '--pomo-focus';
  }

  if (status === POMODORO_STATUS.SHORT_BREAK || status === POMODORO_STATUS.LONG_BREAK) {
    return '--pomo-break';
  }

  return '--accent';
}

function useSceneColors(status) {
  const [colors, setColors] = useState({
    active: 'white',
    accent: 'white',
    track: 'white',
    muted: 'white',
  });

  useEffect(() => {
    setColors({
      active: readCssVariable(getActiveToken(status)),
      accent: readCssVariable('--accent'),
      track: readCssVariable('--bg-surface-3'),
      muted: readCssVariable('--text-tertiary'),
    });
  }, [status]);

  return colors;
}

function createArcGeometry(progress) {
  const safeProgress = Math.max(clampProgress(progress), 0.015);
  const segmentCount = Math.max(Math.ceil(96 * safeProgress), 4);
  const points = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const angle = -Math.PI / 2 + (safeProgress * Math.PI * 2 * index) / segmentCount;
    points.push(new THREE.Vector3(Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, 0.08));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, segmentCount, 0.025, 10, false);
}

function FocusOrbit({ colors, isPaused, progress }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const safeProgress = clampProgress(progress);
  const progressGeometry = useMemo(() => createArcGeometry(safeProgress), [safeProgress]);
  const markerAngle = -Math.PI / 2 + safeProgress * Math.PI * 2;

  useEffect(() => () => progressGeometry.dispose(), [progressGeometry]);

  useFrame(({ clock }, delta) => {
    if (!isPaused && groupRef.current) {
      groupRef.current.rotation.z += delta * 0.18;
    }

    if (coreRef.current) {
      const pulse = isPaused ? 1 : 1 + Math.sin(clock.elapsedTime * 2) * 0.035;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.45, 0.018, 16, 144]} />
        <meshStandardMaterial color={colors.track} transparent opacity={0.72} roughness={0.85} />
      </mesh>

      <mesh geometry={progressGeometry}>
        <meshStandardMaterial
          color={colors.active}
          emissive={colors.active}
          emissiveIntensity={0.14}
          roughness={0.42}
        />
      </mesh>

      <mesh position={[Math.cos(markerAngle) * 1.45, Math.sin(markerAngle) * 1.45, 0.12]}>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial
          color={colors.active}
          emissive={colors.active}
          emissiveIntensity={0.18}
          roughness={0.35}
        />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshStandardMaterial
          color={colors.active}
          emissive={colors.accent}
          emissiveIntensity={0.08}
          transparent
          opacity={0.2}
          roughness={0.7}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.94, 0.01, 12, 96]} />
        <meshStandardMaterial color={colors.muted} transparent opacity={0.32} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Renders the optional lazy-loaded 3D focus progress scene. */
export default function FocusProgressScene({ isPaused = false, progress = 0, status }) {
  const colors = useSceneColors(status);

  return (
    <ThreeCanvasShell
      aria-hidden="true"
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      className="absolute inset-0 min-h-0 rounded-full border-0 bg-transparent shadow-none"
      gl={FOCUS_CANVAS_GL}
      showLabel={false}
    >
      <FocusOrbit colors={colors} isPaused={isPaused} progress={progress} />
    </ThreeCanvasShell>
  );
}
