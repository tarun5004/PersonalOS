import { AVATARS, DEFAULT_AVATAR_ID, resolveAvatarId } from '../../utils/avatars.js';
import { mergeClassNames } from '../../lib/classNames.js';
import { AvatarDisplay } from './AvatarDisplay.jsx';

export function AvatarPicker({ label = 'Choose avatar', onChange, value = DEFAULT_AVATAR_ID }) {
  const selectedAvatarId = resolveAvatarId(value);

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold text-body">{label}</legend>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="radiogroup" aria-label={label}>
        {AVATARS.map((avatar) => {
          const isSelected = selectedAvatarId === avatar.id;

          return (
            <button
              aria-checked={isSelected}
              aria-label={avatar.label}
              className={mergeClassNames(
                'grid place-items-center rounded-card border border-border bg-surface p-1.5 transition hover:-translate-y-px hover:border-accent focus-visible:outline-none focus-visible:shadow-focus',
                isSelected && 'border-accent bg-accent-soft shadow-card',
              )}
              key={avatar.id}
              onClick={() => onChange(avatar.id)}
              role="radio"
              type="button"
            >
              <AvatarDisplay avatarId={avatar.id} size="sm" />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
