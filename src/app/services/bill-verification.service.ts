import { Injectable } from '@angular/core';
import { INVALID_RANGES } from '../constants/invalid-ranges';
import { VERIFICATION_STRINGS } from '../constants/ui-strings';
import { SERIAL_STATUS, VerificationResult } from '../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillVerificationService {

  verify(denomination: number, serial: string, series: string): VerificationResult {
    const numericVal = parseInt(serial, 10);
    const ranges = INVALID_RANGES[denomination]?.[series] ?? [];

    if (ranges.some(r => numericVal >= r.from && numericVal <= r.to)) {
      return {
        status: SERIAL_STATUS.observado,
        title: VERIFICATION_STRINGS.observedTitle,
        message: VERIFICATION_STRINGS.observedMsg(denomination, series),
        serial,
        seriesLetter: series,
        denomination,
      };
    }

    return {
      status: SERIAL_STATUS.noObservado,
      title: VERIFICATION_STRINGS.notObservedTitle,
      message: VERIFICATION_STRINGS.notObservedMsg(denomination, series),
      serial,
      seriesLetter: series,
      denomination,
    };
  }
}
