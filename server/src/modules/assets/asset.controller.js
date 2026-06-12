import { assetService } from './asset.service.js';

export class AssetController {
  constructor(service = assetService) {
    this.service = service;
  }

  generateImage = async (request, response) => {
    const asset = await this.service.generateImageAsset(request.user._id, request.validated.body);

    response.status(201).json({
      success: true,
      data: {
        asset,
      },
    });
  };
}

export const assetController = new AssetController();
