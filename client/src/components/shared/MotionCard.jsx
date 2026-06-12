import { motion } from 'framer-motion';
import { mergeClassNames } from '../../lib/classNames.js';
import { MOTION_PRESETS, MOTION_TRANSITIONS } from '../../utils/interactionTokens.js';

/** Wraps a card-like surface with the standard PersonalOS motion language. */
export function MotionCard({
  as = motion.div,
  children,
  className,
  delay = 0,
  preset = 'card',
  transition = 'standard',
  ...props
}) {
  const Component = as;

  return (
    <Component
      animate="visible"
      className={mergeClassNames('rounded-card border border-border bg-surface shadow-card', className)}
      initial="hidden"
      transition={{ ...MOTION_TRANSITIONS[transition], delay }}
      variants={MOTION_PRESETS[preset]}
      {...props}
    >
      {children}
    </Component>
  );
}
