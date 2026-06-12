import { getAvatar, getAvatarDataUri } from '../../utils/avatars.js';
import { mergeClassNames } from '../../lib/classNames.js';

const SIZES = {
  sm: 'size-9',
  md: 'size-12',
  lg: 'size-16',
};

export function AvatarDisplay({ avatarId, avatarUrl, className, label, size = 'md' }) {
  const avatar = getAvatar(avatarId);
  const accessibleLabel = label || avatar.label;
  const generatedAvatarUrl = getAvatarDataUri(avatarId);

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
      {avatarUrl ? (
        <img alt="" className="h-full w-full object-cover" src={avatarUrl} />
      ) : (
        <img alt="" className="h-full w-full object-cover" src={generatedAvatarUrl} />
      )}
    </span>
  );
}
