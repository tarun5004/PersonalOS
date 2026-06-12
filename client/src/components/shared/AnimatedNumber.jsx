import CountUp from 'react-countup';
import { mergeClassNames } from '../../lib/classNames.js';

/** Animates meaningful numeric progress without changing the surrounding layout. */
export function AnimatedNumber({
  className,
  decimals = 0,
  duration = 0.7,
  end,
  prefix = '',
  preserveValue = true,
  suffix = '',
}) {
  return (
    <span className={mergeClassNames('tabular-nums', className)}>
      <CountUp
        decimals={decimals}
        duration={duration}
        end={Number(end) || 0}
        prefix={prefix}
        preserveValue={preserveValue}
        suffix={suffix}
      />
    </span>
  );
}
