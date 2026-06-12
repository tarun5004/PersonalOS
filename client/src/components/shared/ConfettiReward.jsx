import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { REWARD_INTENSITY } from '../../utils/interactionTokens.js';

export function fireRewardConfetti({ intensity = 'standard', origin = { x: 0.5, y: 0.62 } } = {}) {
  const options = REWARD_INTENSITY[intensity] || REWARD_INTENSITY.standard;
  const rootStyles = getComputedStyle(document.documentElement);
  const colors = [
    rootStyles.getPropertyValue('--accent').trim(),
    rootStyles.getPropertyValue('--success').trim(),
    rootStyles.getPropertyValue('--warning').trim(),
    rootStyles.getPropertyValue('--bg-surface').trim(),
  ].filter(Boolean);

  confetti({
    colors,
    disableForReducedMotion: true,
    origin,
    ...options,
  });
}

/** Fires a short milestone reward when `fireKey` changes to a truthy value. */
export function ConfettiReward({ fireKey, intensity = 'standard' }) {
  useEffect(() => {
    if (!fireKey) {
      return;
    }

    fireRewardConfetti({ intensity });
  }, [fireKey, intensity]);

  return null;
}
