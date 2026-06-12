import { getAvatar } from '../../utils/avatars.js';
import { mergeClassNames } from '../../lib/classNames.js';

const SIZES = {
  sm: 'size-9',
  md: 'size-12',
  lg: 'size-16',
};

export function AvatarDisplay({ avatarId, className, label, size = 'md' }) {
  const avatar = getAvatar(avatarId);
  const accessibleLabel = label || avatar.label;

  return (
    <span
      aria-label={accessibleLabel}
      className={mergeClassNames(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-card border border-border bg-surface shadow-card',
        SIZES[size],
        className,
      )}
      role="img"
    >
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 64 64">
        <rect fill={avatar.background} height="64" rx="10" width="64" />
        <circle cx="32" cy="27" fill={avatar.skin} r="15" />
        <path d="M18 28c1-12 9-19 19-16 6 2 10 7 10 14-7-6-17-7-29 2Z" fill={avatar.hair} />
        <circle cx="26" cy="29" fill="var(--text-primary)" r="1.8" />
        <circle cx="38" cy="29" fill="var(--text-primary)" r="1.8" />
        <path d="M27 36c3 2.4 7.2 2.4 10 0" fill="none" stroke="var(--text-primary)" strokeLinecap="round" strokeWidth="2" />
        <path d="M14 60c2.8-12 10-18 18-18s15.2 6 18 18H14Z" fill={avatar.shirt} />
        <circle cx="48" cy="16" fill={avatar.accent} r="5" />
      </svg>
    </span>
  );
}
