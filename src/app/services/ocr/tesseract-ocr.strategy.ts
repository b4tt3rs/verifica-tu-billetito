import { OcrStrategy, OcrResult } from './ocr-strategy';
import Tesseract from 'tesseract.js';

export class TesseractOcrStrategy implements OcrStrategy {
  private worker: Tesseract.Worker | null = null;

  async recognize(base64Image: string): Promise<OcrResult> {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker('spa');
    }

    const { data } = await this.worker.recognize(`data:image/jpeg;base64,${base64Image}`);

    const blocks = (data.blocks || []).map((block: any) => ({
      lines: (block.lines || []).map((line: any) => ({
        elements: (line.words || []).map((word: any) => ({
          text: word.text,
          boundingBox: {
            left: word.bbox.x0,
            top: word.bbox.y0,
            right: word.bbox.x1,
            bottom: word.bbox.y1,
          },
        })),
      })),
    }));

    return { text: data.text, blocks };
  }
}
