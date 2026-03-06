export type Range = { from: number; to: number };

export type SerialStatus = 'no-observado' | 'observado' | 'formato-invalido';

export const SERIAL_STATUS = {
  noObservado:    'no-observado'    as SerialStatus,
  observado:      'observado'       as SerialStatus,
  formatoInvalido:'formato-invalido' as SerialStatus,
};

export interface VerificationResult {
  status: SerialStatus;
  title: string;
  message: string;
  serial: string;
  seriesLetter: string;
  denomination: number | null;
}

export interface ScanResult {
  serial: string;
  series: string;
  denomination: number | null;
}

export interface Denomination {
  value: number;
  cssClass: string;
}
