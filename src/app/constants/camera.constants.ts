export const SCAN_INTERVAL_MS       = 1500;
export const SCAN_START_DELAY_MS    = 80;

export const CANVAS_DEFAULT_WIDTH   = 1280;
export const CANVAS_DEFAULT_HEIGHT  = 720;
export const JPEG_QUALITY           = 0.85;
export const IMAGE_FORMAT           = 'image/jpeg' as const;

export const SERIAL_REGEX           = /(\d{6,10})\s*([A-Z])\b/;
export const SERIAL_MAX_DIGITS      = 10;
export const SERIAL_INPUT_MAX_LENGTH  = 10;
export const SERIES_INPUT_MAX_LENGTH  = 3;

export const DENOMINATION_STRING_VALUES = ['10', '20', '50', '100', '200'] as const;

export const DENOMINATION_WORDS: Record<string, number> = {
  DOSCIENTOS: 200,
  CIEN:       100,
  CINCUENTA:  50,
  VEINTE:     20,
  DIEZ:       10,
};
