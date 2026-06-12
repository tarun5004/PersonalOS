import OpenAI from 'openai';
import { env } from '../../config/env.js';
import { uploadCloudinaryImage } from '../../config/cloudinary.js';
import { AppError, AuthError } from '../../errors/AppError.js';
import { User } from '../auth/auth.model.js';

function buildAssetPrompt({ assetType, prompt }) {
  if (assetType === 'dashboardBackground') {
    return [
      'Create a premium Personal OS dashboard background image.',
      'Style: calm productivity cockpit, refined desktop app, subtle depth, no text, no logos, no UI screenshots.',
      'Use mature soft neutrals with restrained teal accents and enough negative space for dashboard cards.',
      `User direction: ${prompt}`,
    ].join(' ');
  }

  return prompt;
}

function getGeneratedImageSource(image) {
  if (image?.b64_json) {
    return `data:image/png;base64,${image.b64_json}`;
  }

  if (image?.url) {
    return image.url;
  }

  return '';
}

export class AssetService {
  constructor({
    UserModel = User,
    imageUploader = uploadCloudinaryImage,
    openAiClient = null,
  } = {}) {
    this.UserModel = UserModel;
    this.imageUploader = imageUploader;
    this.openAiClient = openAiClient;
  }

  getOpenAiClient() {
    if (!env.OPENAI_API_KEY) {
      throw new AppError('OpenAI image generation is not configured', 503, [], 'OPENAI_NOT_CONFIGURED');
    }

    if (!this.openAiClient) {
      this.openAiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }

    return this.openAiClient;
  }

  async generateImageAsset(userId, { assetType, prompt }) {
    const client = this.getOpenAiClient();
    const imageResponse = await client.images.generate({
      model: env.OPENAI_IMAGE_MODEL,
      prompt: buildAssetPrompt({ assetType, prompt }),
      size: '1024x1024',
    });
    const imageSource = getGeneratedImageSource(imageResponse.data?.[0]);

    if (!imageSource) {
      throw new AppError('OpenAI did not return an image', 502, [], 'OPENAI_IMAGE_EMPTY');
    }

    const upload = await this.imageUploader({
      dataUrl: imageSource,
      folder: 'generated-assets',
      publicIdPrefix: `${assetType}-${userId}`,
      tags: ['personal-os', 'ai-generated', assetType],
    });

    if (assetType === 'dashboardBackground') {
      const user = await this.UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            dashboardBackgroundPublicId: upload.publicId,
            dashboardBackgroundUrl: upload.url,
          },
        },
        { new: true },
      );

      if (!user) {
        throw new AuthError('Authentication required');
      }
    }

    return {
      assetType,
      publicId: upload.publicId,
      url: upload.url,
    };
  }
}

export const assetService = new AssetService();
