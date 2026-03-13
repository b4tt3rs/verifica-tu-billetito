export interface OcrResult {
  text: string;
  blocks: any[];
}

export interface OcrStrategy {
  recognize(base64Image: string): Promise<OcrResult>;
}
