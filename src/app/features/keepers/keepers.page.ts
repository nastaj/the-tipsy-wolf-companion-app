import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { IonContent, IonHeader, IonIcon } from '@ionic/angular';
import { LeaderboardService } from '../../data/leaderboard.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { formatDuration } from '../../shared/format';

@Component({
  selector: 'app-keepers',
  templateUrl: 'keepers.page.html',
  imports: [IonHeader, IonContent, IonIcon, PageHeaderComponent, DecimalPipe],
})
export class KeepersPage {
  private readonly leaderboard = inject(LeaderboardService);

  protected readonly levels = toSignal(this.leaderboard.getLevels(), { initialValue: [] as number[] });
  protected readonly level = signal(1);
  protected readonly entries = rxResource({
    params: () => this.level(),
    stream: ({ params }) => this.leaderboard.getLeaderboard(params),
  });

  protected readonly formatDuration = formatDuration;

  protected onLevelChange(event: Event): void {
    this.level.set(Number((event.target as HTMLSelectElement).value));
  }
}
