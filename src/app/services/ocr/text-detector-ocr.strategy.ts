import { OcrStrategy, OcrResult } from './ocr-strategy';

export class TextDetectorOcrStrategy implements OcrStrategy {
  async recognize(base64Image: string): Promise<OcrResult> {
    const detector = new (window as any).TextDetector();
    const blob = await fetch(`data:image/jpeg;base64,${base64Image}`).then(r => r.blob());
    const bitmap = await createImageBitmap(blob);
    const detections: any[] = await detector.detect(bitmap);
    bitmap.close();

    const text = detections.map(d => d.rawValue).join('\n');
    const blocks = detections.map(d => ({
      lines: [{
        elements: [{
          text: d.rawValue,
          boundingBox: {
            left: d.boundingBox.x,
            top: d.boundingBox.y,
            right: d.boundingBox.x + d.boundingBox.width,
            bottom: d.boundingBox.y + d.boundingBox.height,
          },
        }],
      }],
    }));

    return { text, blocks };
  }

  static isSupported(): boolean {
    return 'TextDetector' in window;
  }
}
