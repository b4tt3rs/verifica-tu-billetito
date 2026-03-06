import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  shieldCheckmark,
  barcodeOutline,
  searchOutline,
  closeCircle,
  checkmarkCircle,
  alertCircle,
  refreshOutline,
  informationCircleOutline,
  cameraOutline,
  closeOutline,
  scanOutline,
  helpCircleOutline,
} from 'ionicons/icons';
import { BillVerificationService } from '../../services/bill-verification.service';
import { CameraScanService } from '../../services/camera-scan.service';
import { HOME_STRINGS } from '../../constants/ui-strings';
import { DENOMINATIONS_SMALL, DENOMINATIONS_LARGE } from '../../constants/denominations';
import { SCAN_START_DELAY_MS, SERIAL_INPUT_MAX_LENGTH, SERIES_INPUT_MAX_LENGTH } from '../../constants/camera.constants';
import { Denomination, SERIAL_STATUS, VerificationResult } from '../../models/bill.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
  imports: [FormsModule, RouterLink, IonContent, IonIcon],
})
export class HomePage {
  @ViewChild('scanVideo') private scanVideoRef!: ElementRef<HTMLVideoElement>;

  readonly strings             = HOME_STRINGS;
  readonly status              = SERIAL_STATUS;
  readonly serialMaxLength     = SERIAL_INPUT_MAX_LENGTH;
  readonly seriesMaxLength     = SERIES_INPUT_MAX_LENGTH;
  readonly denominationsSmall: Denomination[] = DENOMINATIONS_SMALL;
  readonly denominationsLarge: Denomination[] = DENOMINATIONS_LARGE;

  serialNumber      = '';
  seriesLetter      = '';
  result: VerificationResult | null = null;
  selectedDenomination: number | null = null;
  scanning          = false;
  liveScanning      = false;
  processing        = false;
  alertModal: { header: string; message: string } | null = null;

  constructor(
    private verificationService: BillVerificationService,
    private cameraScan: CameraScanService,
  ) {
    addIcons({
      cashOutline, shieldCheckmark, barcodeOutline, searchOutline,
      closeCircle, checkmarkCircle, alertCircle, refreshOutline,
      informationCircleOutline, cameraOutline, closeOutline, scanOutline, helpCircleOutline,
    });
  }

  onSerialChange(value: string) {
    this.serialNumber = value.replace(/\D/g, '');
    this.result = null;
  }

  onLetterChange(value: string) {
    this.seriesLetter = value.replace(/[^A-Za-z]/g, '').toUpperCase();
    this.result = null;
  }

  selectDenomination(value: number) {
    this.selectedDenomination = this.selectedDenomination === value ? null : value;
    this.result = null;
  }

  async startLiveScan() {
    this.serialNumber        = '';
    this.seriesLetter        = '';
    this.result              = null;
    this.selectedDenomination = null;
    this.liveScanning        = true;

    await new Promise(r => setTimeout(r, SCAN_START_DELAY_MS));

    try {
      await this.cameraScan.startCamera(
        this.scanVideoRef.nativeElement,
        () => this.captureAndProcess(false),
      );
    } catch {
      this.liveScanning = false;
      this.result = {
        status: SERIAL_STATUS.formatoInvalido,
        title: HOME_STRINGS.alerts.cameraErrorTitle,
        message: HOME_STRINGS.alerts.cameraErrorMsg,
        serial: '', seriesLetter: '', denomination: null,
      };
    }
  }

  stopLiveScan() {
    this.cameraScan.stop();
    this.liveScanning = false;
    this.processing   = false;
  }

  async captureAndProcess(isManual: boolean) {
    if (this.processing || !this.liveScanning) return;
    this.processing = true;
    try {
      const scan = await this.cameraScan.captureFrame(this.scanVideoRef.nativeElement);
      const hasAll = scan.serial.length > 0 && scan.series.length > 0 && scan.denomination !== null;

      if (hasAll || isManual) {
        this.serialNumber        = scan.serial;
        this.seriesLetter        = scan.series;
        this.selectedDenomination = scan.denomination;
        this.stopLiveScan();

        if (scan.serial.length > 0) {
          this.verify();
        } else {
          this.result = {
            status: SERIAL_STATUS.formatoInvalido,
            title: HOME_STRINGS.alerts.noDetectionTitle,
            message: HOME_STRINGS.alerts.noDetectionMsg,
            serial: '', seriesLetter: '', denomination: null,
          };
        }
      }
    } catch {
      if (isManual) {
        this.stopLiveScan();
        this.result = {
          status: SERIAL_STATUS.formatoInvalido,
          title: HOME_STRINGS.alerts.processErrorTitle,
          message: HOME_STRINGS.alerts.processErrorMsg,
          serial: '', seriesLetter: '', denomination: null,
        };
      }
    } finally {
      this.processing = false;
    }
  }

  verify() {
    const serial = this.serialNumber.trim();
    const series = this.seriesLetter.trim();

    if (!this.selectedDenomination) {
      this.alertModal = { header: HOME_STRINGS.alerts.noDenominationHeader, message: HOME_STRINGS.alerts.noDenominationMsg };
      return;
    }
    if (!serial) {
      this.alertModal = { header: HOME_STRINGS.alerts.noSerialHeader, message: HOME_STRINGS.alerts.noSerialMsg };
      return;
    }
    if (!series) {
      this.alertModal = { header: HOME_STRINGS.alerts.noSeriesHeader, message: HOME_STRINGS.alerts.noSeriesMsg };
      return;
    }

    this.result = this.verificationService.verify(this.selectedDenomination, serial, series);
  }

  dismissAlert()  { this.alertModal = null; }
  dismissResult() { this.result     = null; }

  clear() {
    this.serialNumber        = '';
    this.seriesLetter        = '';
    this.result              = null;
    this.selectedDenomination = null;
  }
}
