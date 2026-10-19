import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  tab: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  templateUrl: 'shell.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, RouterLinkActive],
})
export class ShellPage {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly nav: NavItem[] = [
    { tab: 'keepers', label: 'Top Keepers', icon: 'trophy-outline' },
    { tab: 'market', label: 'Marketplace', icon: 'bag-handle-outline' },
    { tab: 'reviews', label: 'Reviews', icon: 'person-outline' },
  ];

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
