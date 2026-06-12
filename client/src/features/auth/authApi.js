import { apiRequest } from '../../lib/apiClient.js';

function getUserFromPayload(payload) {
  return payload?.data?.user || null;
}

function getSessionFromPayload(payload) {
  return {
    user: payload?.data?.user || null,
    accessToken: payload?.data?.accessToken || '',
  };
}

export async function registerUser(values) {
  const payload = await apiRequest('/auth/register', {
    method: 'POST',
    body: values,
    auth: false,
    skipAuthRefresh: true,
  });

  return getSessionFromPayload(payload);
}

export async function loginUser(values) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    body: values,
    auth: false,
    skipAuthRefresh: true,
  });

  return getSessionFromPayload(payload);
}

export async function logoutUser() {
  await apiRequest('/auth/logout', {
    method: 'POST',
    auth: false,
    skipAuthRefresh: true,
  });
}

export async function refreshAuthSession() {
  const payload = await apiRequest('/auth/refresh', {
    method: 'POST',
    auth: false,
    skipAuthRefresh: true,
  });

  return getSessionFromPayload(payload);
}

export async function getCurrentUser() {
  const payload = await apiRequest('/auth/me');

  return getUserFromPayload(payload);
}

export async function uploadAvatarImage(dataUrl) {
  const payload = await apiRequest('/auth/me/avatar', {
    method: 'PATCH',
    body: { dataUrl },
  });

  return getUserFromPayload(payload);
}
