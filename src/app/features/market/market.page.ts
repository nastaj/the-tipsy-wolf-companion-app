import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { AlertController, IonContent, IonHeader, IonIcon, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { MarketService } from '../../data/market.service';
import { MarketCategory, MarketItem } from '../../data/models';
import { PageHeaderComponent } from '../../shared/page-header.component';

@Component({
  selector: 'app-market',
  templateUrl: 'market.page.html',
  imports: [IonHeader, IonContent, IonIcon, PageHeaderComponent, DecimalPipe],
})
export class MarketPage {
  protected readonly market = inject(MarketService);
  private readonly alerts = inject(AlertController);
  private readonly toasts = inject(ToastController);

  protected readonly categories: { value: MarketCategory; label: string; singular: string }[] = [
    { value: 'resource', label: 'Resources', singular: 'Resource' },
    { value: 'amenity', label: 'Amenities', singular: 'Amenity' },
    { value: 'upgrade', label: 'Upgrades', singular: 'Upgrade' },
  ];

  protected readonly category = signal<MarketCategory>('resource');
  protected readonly query = signal('');
  protected readonly items = rxResource({
    params: () => ({ category: this.category(), query: this.query() }),
    stream: ({ params }) => this.market.getItems(params.category, params.query),
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected categoryLabel(category: MarketCategory): string {
    return this.categories.find((c) => c.value === category)?.singular ?? '';
  }

  protected async buy(item: MarketItem): Promise<void> {
    const alert = await this.alerts.create({
      header: `Buy ${item.name}?`,
      message: `This will cost ${item.price.toLocaleString()} gold.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Buy', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') return;

    try {
      await firstValueFrom(this.market.purchase(item));
      await this.toast(`${item.name} added to your stores.`);
    } catch (e) {
      await this.toast(e instanceof Error ? e.message : 'Purchase failed.');
    }
  }

  private async toast(message: string): Promise<void> {
    const toast = await this.toasts.create({ message, duration: 2000, position: 'top' });
    await toast.present();
  }
}
