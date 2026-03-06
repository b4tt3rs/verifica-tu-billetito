import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import { TUTORIAL_STEPS, TutorialStep } from '../../constants/tutorial-steps';
import { TUTORIAL_NAV_STRINGS } from '../../constants/ui-strings';

@Component({
  selector: 'app-tutorial',
  templateUrl: 'tutorial.page.html',
  styleUrls: ['tutorial.page.css'],
  imports: [IonContent, IonIcon],
})
export class TutorialPage {
  step = 0;
  readonly steps: TutorialStep[] = TUTORIAL_STEPS;
  readonly nav = TUTORIAL_NAV_STRINGS;

  constructor(private router: Router) {
    addIcons({ chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkCircle });
  }

  next() {
    if (this.step < this.steps.length - 1) {
      this.step++;
    } else {
      this.router.navigate(['/home']);
    }
  }

  prev() {
    if (this.step > 0) {
      this.step--;
    }
  }

  close() {
    this.router.navigate(['/home']);
  }
}
