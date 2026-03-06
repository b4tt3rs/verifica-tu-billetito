import { OcrStrategy, OcrResult } from './ocr-strategy';
import { CapacitorPluginMlKitTextRecognition as MlKit } from '@pantrist/capacitor-plugin-ml-kit-text-recognition';

export class MlKitOcrStrategy implements OcrStrategy {
  async recognize(base64Image: string): Promise<OcrResult> {
    const { text, blocks } = await MlKit.detectText({ base64Image });
    return { text, blocks };
  }
}
