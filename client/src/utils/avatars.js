import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import { rgbToHex } from './colorValues.js';

export const AVATAR_STORAGE_KEY = 'pos-avatar-id';
export const DEFAULT_AVATAR_ID = 'teal-reader';
const avatarDataUriCache = new Map();

export const AVATARS = [
  {
    id: 'teal-reader',
    label: 'Teal reader',
    background: rgbToHex(230, 244, 241),
    skin: rgbToHex(241, 198, 168),
    hair: rgbToHex(61, 48, 40),
    shirt: rgbToHex(15, 123, 108),
    accent: rgbToHex(223, 171, 1),
  },
  {
    id: 'amber-planner',
    label: 'Amber planner',
    background: rgbToHex(251, 243, 219),
    skin: rgbToHex(221, 170, 133),
    hair: rgbToHex(47, 39, 34),
    shirt: rgbToHex(223, 171, 1),
    accent: rgbToHex(15, 123, 108),
  },
  {
    id: 'graphite-thinker',
    label: 'Graphite thinker',
    background: rgbToHex(236, 235, 232),
    skin: rgbToHex(185, 137, 111),
    hair: rgbToHex(25, 25, 25),
    shirt: rgbToHex(120, 119, 116),
    accent: rgbToHex(15, 123, 108),
  },
  {
    id: 'rose-maker',
    label: 'Rose maker',
    background: rgbToHex(249, 231, 236),
    skin: rgbToHex(240, 183, 158),
    hair: rgbToHex(91, 42, 53),
    shirt: rgbToHex(212, 83, 126),
    accent: rgbToHex(223, 171, 1),
  },
  {
    id: 'blue-focus',
    label: 'Blue focus',
    background: rgbToHex(231, 240, 248),
    skin: rgbToHex(201, 147, 115),
    hair: rgbToHex(37, 50, 74),
    shirt: rgbToHex(55, 138, 221),
    accent: rgbToHex(15, 123, 108),
  },
  {
    id: 'violet-operator',
    label: 'Violet operator',
    background: rgbToHex(238, 234, 248),
    skin: rgbToHex(224, 169, 140),
    hair: rgbToHex(47, 37, 69),
    shirt: rgbToHex(127, 119, 221),
    accent: rgbToHex(212, 83, 126),
  },
  {
    id: 'olive-builder',
    label: 'Olive builder',
    background: rgbToHex(237, 243, 229),
    skin: rgbToHex(208, 154, 123),
    hair: rgbToHex(51, 42, 28),
    shirt: rgbToHex(99, 153, 34),
    accent: rgbToHex(223, 171, 1),
  },
  {
    id: 'red-sprinter',
    label: 'Red sprinter',
    background: rgbToHex(253, 236, 236),
    skin: rgbToHex(184, 120, 93),
    hair: rgbToHex(42, 23, 20),
    shirt: rgbToHex(192, 57, 43),
    accent: rgbToHex(15, 123, 108),
  },
];

export function isAvatarId(value) {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function getAvatar(value) {
  return AVATARS.find((avatar) => avatar.id === value) || AVATARS[0];
}

export function getAvatarDataUri(value) {
  const avatar = getAvatar(value);

  if (!avatarDataUriCache.has(avatar.id)) {
    const generatedAvatar = createAvatar(notionistsNeutral, {
      backgroundColor: [avatar.background.replace('#', '')],
      radius: 18,
      seed: avatar.id,
      size: 96,
    });

    avatarDataUriCache.set(avatar.id, generatedAvatar.toDataUri());
  }

  return avatarDataUriCache.get(avatar.id);
}

export function resolveAvatarId(value) {
  return isAvatarId(value) ? value : DEFAULT_AVATAR_ID;
}

export function readStoredAvatarId() {
  if (typeof window === 'undefined') {
    return DEFAULT_AVATAR_ID;
  }

  try {
    return resolveAvatarId(window.localStorage.getItem(AVATAR_STORAGE_KEY));
  } catch {
    return DEFAULT_AVATAR_ID;
  }
}

export function writeStoredAvatarId(value) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(AVATAR_STORAGE_KEY, resolveAvatarId(value));
  } catch {
    // Avatar preference is non-critical UI state.
  }
}
