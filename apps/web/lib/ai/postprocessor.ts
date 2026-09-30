import { BoundingBox } from './types';

export interface RawDetection {
  classIndex: number;
  score: number;
  box: BoundingBox;
}

export function calculateIoU(boxA: BoundingBox, boxB: BoundingBox): number {
  const xA = Math.max(boxA.x, boxB.x);
  const yA = Math.max(boxA.y, boxB.y);
  const xB = Math.min(boxA.x + boxA.width, boxB.x + boxB.width);
  const yB = Math.min(boxA.y + boxA.height, boxB.y + boxB.height);

  const interWidth = Math.max(0, xB - xA);
  const interHeight = Math.max(0, yB - yA);
  const interArea = interWidth * interHeight;

  const boxAArea = boxA.width * boxA.height;
  const boxBArea = boxB.width * boxB.height;
  const unionArea = boxAArea + boxBArea - interArea;

  return unionArea > 0 ? interArea / unionArea : 0;
}

export function nonMaxSuppression(
  detections: RawDetection[],
  iouThreshold = 0.45
): RawDetection[] {
  // Sort descending by confidence score
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const picked: RawDetection[] = [];

  for (const current of sorted) {
    let keep = true;
    for (const prior of picked) {
      if (calculateIoU(current.box, prior.box) > iouThreshold) {
        keep = false;
        break;
      }
    }
    if (keep) {
      picked.push(current);
    }
  }

  return picked;
}

export function parseYolo11Output(
  outputTensor: Float32Array,
  numClasses: number,
  scale: number,
  padX: number,
  padY: number,
  originalWidth: number,
  originalHeight: number,
  confThreshold = 0.45,
  dims?: readonly number[] | number[]
): RawDetection[] {
  const detections: RawDetection[] = [];
  const numChannels = 4 + numClasses;
  
  let numAnchors = 8400;
  let isChannelsFirst = true;

  if (dims && dims.length === 3) {
    if (dims[1] === numChannels) {
      isChannelsFirst = true;
      numAnchors = dims[2];
    } else if (dims[2] === numChannels) {
      isChannelsFirst = false;
      numAnchors = dims[1];
    }
  } else {
    numAnchors = Math.floor(outputTensor.length / numChannels);
  }

  for (let a = 0; a < numAnchors; a++) {
    // Find best class score among class channels
    let maxScore = -1;
    let bestClass = -1;

    for (let c = 0; c < numClasses; c++) {
      const idx = isChannelsFirst ? (4 + c) * numAnchors + a : a * numChannels + (4 + c);
      const score = outputTensor[idx];
      if (score > maxScore) {
        maxScore = score;
        bestClass = c;
      }
    }

    if (maxScore >= confThreshold) {
      const cxIdx = isChannelsFirst ? 0 * numAnchors + a : a * numChannels + 0;
      const cyIdx = isChannelsFirst ? 1 * numAnchors + a : a * numChannels + 1;
      const wIdx  = isChannelsFirst ? 2 * numAnchors + a : a * numChannels + 2;
      const hIdx  = isChannelsFirst ? 3 * numAnchors + a : a * numChannels + 3;

      const cx = outputTensor[cxIdx];
      const cy = outputTensor[cyIdx];
      const w = outputTensor[wIdx];
      const h = outputTensor[hIdx];

      // Convert from 640 letterbox coordinates to original pixel coordinates
      const origX = Math.max(0, (cx - w / 2 - padX) / scale);
      const origY = Math.max(0, (cy - h / 2 - padY) / scale);
      const origW = Math.min(originalWidth - origX, w / scale);
      const origH = Math.min(originalHeight - origY, h / scale);

      detections.push({
        classIndex: bestClass,
        score: maxScore,
        box: {
          x: Math.round(origX),
          y: Math.round(origY),
          width: Math.round(origW),
          height: Math.round(origH),
        }
      });
    }
  }

  return nonMaxSuppression(detections);
}
