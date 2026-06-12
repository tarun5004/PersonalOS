import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';

export const AVATAR_STORAGE_KEY = 'pos-avatar-id';
export const DEFAULT_AVATAR_ID = 'teal-reader';
const avatarDataUriCache = new Map();

export const AVATARS = [
  {
    id: 'teal-reader',
    label: 'Teal reader',
    background: '#E6F4F1',
    skin: '#F1C6A8',
    hair: '#3D3028',
    shirt: '#0F7B6C',
    accent: '#DFAB01',
  },
  {
    id: 'amber-planner',
    label: 'Amber planner',
    background: '#FBF3DB',
    skin: '#DDAA85',
    hair: '#2F2722',
    shirt: '#DFAB01',
    accent: '#0F7B6C',
  },
  {
    id: 'graphite-thinker',
    label: 'Graphite thinker',
    background: '#ECEBE8',
    skin: '#B9896F',
    hair: '#191919',
    shirt: '#787774',
    accent: '#0F7B6C',
  },
  {
    id: 'rose-maker',
    label: 'Rose maker',
    background: '#F9E7EC',
    skin: '#F0B79E',
    hair: '#5B2A35',
    shirt: '#D4537E',
    accent: '#DFAB01',
  },
  {
    id: 'blue-focus',
    label: 'Blue focus',
    background: '#E7F0F8',
    skin: '#C99373',
    hair: '#25324A',
    shirt: '#378ADD',
    accent: '#0F7B6C',
  },
  {
    id: 'violet-operator',
    label: 'Violet operator',
    background: '#EEEAF8',
    skin: '#E0A98C',
    hair: '#2F2545',
    shirt: '#7F77DD',
    accent: '#D4537E',
  },
  {
    id: 'olive-builder',
    label: 'Olive builder',
    background: '#EDF3E5',
    skin: '#D09A7B',
    hair: '#332A1C',
    shirt: '#639922',
    accent: '#DFAB01',
  },
  {
    id: 'red-sprinter',
    label: 'Red sprinter',
    background: '#FDECEC',
    skin: '#B8785D',
    hair: '#2A1714',
    shirt: '#C0392B',
    accent: '#0F7B6C',
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
