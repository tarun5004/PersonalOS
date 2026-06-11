import { apiRequest } from '../../lib/apiClient.js';

function getUserFromPayload(payload) {
  return payload?.data?.user || null;
}

export async function registerUser(values) {
  const payload = await apiRequest('/auth/register', {
    method: 'POST',
    body: values,
  });

  return getUserFromPayload(payload);
}

export async function loginUser(values) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    body: values,
  });

  return getUserFromPayload(payload);
}

export async function logoutUser() {
  await apiRequest('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser() {
  const payload = await apiRequest('/auth/me');

  return getUserFromPayload(payload);
}
