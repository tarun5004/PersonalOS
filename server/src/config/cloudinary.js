import crypto from 'crypto';
import { env } from './env.js';
import { AppError } from '../errors/AppError.js';

function getCloudinaryConfig() {
  const config = {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    folder: env.CLOUDINARY_ASSET_FOLDER || 'personal-os',
  };

  if (!config.cloudName || !config.apiKey || !config.apiSecret) {
    throw new AppError('Cloudinary is not configured', 503, [], 'CLOUDINARY_NOT_CONFIGURED');
  }

  return config;
}

function signParams(params, apiSecret) {
  const signatureBase = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '')
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('sha1').update(`${signatureBase}${apiSecret}`).digest('hex');
}

function optimizeDeliveryUrl(url) {
  if (!url || !url.includes('/upload/')) {
    return url;
  }

  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

export async function uploadCloudinaryImage({ dataUrl, folder, publicIdPrefix = 'asset', tags = [] }) {
  const config = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadFolder = `${config.folder}/${folder}`.replace(/\/+/g, '/');
  const publicId = `${publicIdPrefix}-${crypto.randomUUID()}`;
  const params = {
    folder: uploadFolder,
    overwrite: true,
    public_id: publicId,
    tags: tags.join(','),
    timestamp,
  };
  const formData = new FormData();

  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  formData.append('file', dataUrl);
  formData.append('api_key', config.apiKey);
  formData.append('signature', signParams(params, config.apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AppError(
      payload?.error?.message || 'Cloudinary upload failed',
      response.status >= 500 ? 502 : 400,
      [],
      'CLOUDINARY_UPLOAD_FAILED',
    );
  }

  return {
    publicId: payload.public_id,
    url: optimizeDeliveryUrl(payload.secure_url),
  };
}
