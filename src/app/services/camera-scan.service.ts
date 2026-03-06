import { Injectable } from '@angular/core';
import { CapacitorPluginMlKitTextRecognition as MlKit } from '@pantrist/capacitor-plugin-ml-kit-text-recognition';
import { ScanResult } from '../models/bill.model';
import {
  SCAN_INTERVAL_MS,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT,
  JPEG_QUALITY,
  IMAGE_FORMAT,
  SERIAL_REGEX,
  SERIAL_MAX_DIGITS,
  DENOMINATION_STRING_VALUES,
  DENOMINATION_WORDS,
} from '../constants/camera.constants';

@Injectable({ providedIn: 'root' })
export class CameraScanService {
  private streamRef: MediaStream | null = null;
  private scanIntervalRef: ReturnType<typeof setInterval> | null = null;

  async startCamera(videoEl: HTMLVideoElement, onFrame: () => void): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
    });
    this.streamRef = stream;
    videoEl.srcObject = stream;
    await videoEl.play();
    this.scanIntervalRef = setInterval(onFrame, SCAN_INTERVAL_MS);
  }

  stop(): void {
    if (this.scanIntervalRef) {
      clearInterval(this.scanIntervalRef);
      this.scanIntervalRef = null;
    }
    if (this.streamRef) {
      this.streamRef.getTracks().forEach(t => t.stop());
      this.streamRef = null;
    }
  }

  async captureFrame(videoEl: HTMLVideoElement): Promise<ScanResult> {
    const canvas = document.createElement('canvas');
    canvas.width  = videoEl.videoWidth  || CANVAS_DEFAULT_WIDTH;
    canvas.height = videoEl.videoHeight || CANVAS_DEFAULT_HEIGHT;
    canvas.getContext('2d')!.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL(IMAGE_FORMAT, JPEG_QUALITY).split(',')[1];

    const { text, blocks } = await MlKit.detectText({ base64Image: base64 });

    const denomination = this.detectDenomination(text, blocks);
    const { serial, series } = this.extractSerial(text);

    return { serial, series, denomination };
  }

  private detectDenomination(text: string, blocks: any[]): number | null {
    let bestDen: number | null = null;
    let bestArea = 0;

    for (const block of blocks) {
      for (const line of block.lines) {
        for (const el of line.elements) {
          const clean = el.text.replace(/[^0-9]/g, '');
          if ((DENOMINATION_STRING_VALUES as readonly string[]).includes(clean)) {
            const bb = el.boundingBox;
            const area = (bb.right - bb.left) * (bb.bottom - bb.top);
            if (area > bestArea) { bestArea = area; bestDen = parseInt(clean, 10); }
          }
        }
      }
    }

    if (bestDen === null) {
      const upper = text.toUpperCase();
      for (const [word, value] of Object.entries(DENOMINATION_WORDS)) {
        if (upper.includes(word)) { bestDen = value; break; }
      }
    }

    return bestDen;
  }

  private extractSerial(text: string): { serial: string; series: string } {
    const match = text.match(SERIAL_REGEX);
    if (match) {
      return { serial: match[1], series: match[2] };
    }
    return { serial: text.replace(/\D/g, '').slice(0, SERIAL_MAX_DIGITS), series: '' };
  }
}
