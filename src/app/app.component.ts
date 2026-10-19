import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowForwardOutline,
  atOutline,
  bagHandleOutline,
  chevronDownOutline,
  chevronUpOutline,
  contrastOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logOutOutline,
  moonOutline,
  personOutline,
  searchOutline,
  star,
  starOutline,
  sunnyOutline,
  trophyOutline,
} from 'ionicons/icons';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Instantiated here so the theme class is applied before any page renders.
  private readonly theme = inject(ThemeService);

  constructor() {
    addIcons({
      addOutline,
      arrowForwardOutline,
      atOutline,
      bagHandleOutline,
      chevronDownOutline,
      chevronUpOutline,
      contrastOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
      logOutOutline,
      moonOutline,
      personOutline,
      searchOutline,
      star,
      starOutline,
      sunnyOutline,
      trophyOutline,
    });
  }
}
