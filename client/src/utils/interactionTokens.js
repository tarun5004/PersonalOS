export const MOTION_PRESETS = {
  card: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  },
  page: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  },
  reward: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const MOTION_TRANSITIONS = {
  fast: { duration: 0.16, ease: 'easeOut' },
  standard: { duration: 0.24, ease: 'easeOut' },
  calm: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
};

export const REWARD_INTENSITY = {
  subtle: { particleCount: 28, spread: 40, scalar: 0.72 },
  standard: { particleCount: 54, spread: 58, scalar: 0.86 },
  milestone: { particleCount: 90, spread: 74, scalar: 1 },
};
