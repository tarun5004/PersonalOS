import { apiRequest } from '../../lib/apiClient.js';

export async function generateImageAsset(values) {
  const payload = await apiRequest('/assets/images', {
    method: 'POST',
    body: values,
  });

  return payload?.data?.asset || null;
}
