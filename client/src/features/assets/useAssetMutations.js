import { useMutation } from '@tanstack/react-query';
import { generateImageAsset } from './assetApi.js';

export function useGenerateImageAsset() {
  return useMutation({
    mutationFn: generateImageAsset,
  });
}
