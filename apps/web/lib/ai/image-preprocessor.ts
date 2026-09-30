/**
 * Prepares image for YOLO11n ONNX inference:
 * - Resizes to 640x640 with letterboxing (preserves aspect ratio with grey padding)
 * - Converts RGBA ImageData to Float32Array RGB tensor in planar [1, 3, 640, 640] format
 * - Values normalized from [0, 255] to [0.0, 1.0]
 */

export interface PreprocessedImage {
  tensorData: Float32Array;
  scale: number;
  padX: number;
  padY: number;
  originalWidth: number;
  originalHeight: number;
}

export async function preprocessImage(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  targetWidth = 640,
  targetHeight = 640
): Promise<PreprocessedImage> {
  const origW = imageSource.width;
  const origH = imageSource.height;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Unable to create 2D canvas rendering context.');
  }

  // Calculate letterbox scaling
  const scale = Math.min(targetWidth / origW, targetHeight / origH);
  const newW = Math.round(origW * scale);
  const newH = Math.round(origH * scale);
  const padX = Math.round((targetWidth - newW) / 2);
  const padY = Math.round((targetHeight - newH) / 2);

  // Fill canvas with grey (114/255 standard YOLO letterbox background)
  ctx.fillStyle = '#727272';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Draw image scaled in center
  ctx.drawImage(imageSource, 0, 0, origW, origH, padX, padY, newW, newH);

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const rgba = imgData.data;

  // YOLO expects NCHW format: [1, 3, targetHeight, targetWidth]
  // Channel order: R, G, B
  const channelSize = targetWidth * targetHeight;
  const tensorData = new Float32Array(3 * channelSize);

  for (let i = 0; i < channelSize; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];

    tensorData[i] = r / 255.0;                         // R plane
    tensorData[channelSize + i] = g / 255.0;            // G plane
    tensorData[2 * channelSize + i] = b / 255.0;        // B plane
  }

  return {
    tensorData,
    scale,
    padX,
    padY,
    originalWidth: origW,
    originalHeight: origH,
  };
}
