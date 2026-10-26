import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { IonContent, IonHeader, IonIcon } from '@ionic/angular';
import { ReviewFilter, ReviewSort } from '../../data/models';
import { ReviewsService } from '../../data/reviews.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-reviews',
  templateUrl: 'reviews.page.html',
  imports: [IonHeader, IonContent, IonIcon, PageHeaderComponent, StarRatingComponent, DecimalPipe],
})
export class ReviewsPage {
  private readonly reviewsService = inject(ReviewsService);

  protected readonly filters: { value: ReviewFilter; label: string }[] = [
    { value: 'all', label: 'All ratings' },
    { value: 'five', label: '5 stars' },
    { value: 'four-below', label: '4 & below' },
  ];

  protected readonly reputation = toSignal(this.reviewsService.getReputation());
  protected readonly reputationTitle = computed(() => {
    const avg = this.reputation()?.average ?? 0;
    if (avg >= 4.5) return 'A local favourite';
    if (avg >= 3.5) return 'Well regarded';
    if (avg >= 2.5) return 'Mixed reputation';
    return 'Best avoided';
  });

  protected readonly filter = signal<ReviewFilter>('all');
  protected readonly sort = signal<ReviewSort>('newest');
  protected readonly reviews = rxResource({
    params: () => ({ filter: this.filter(), sort: this.sort() }),
    stream: ({ params }) => this.reviewsService.getReviews(params.filter, params.sort),
  });

  protected toggleSort(): void {
    this.sort.update((s) => (s === 'newest' ? 'oldest' : 'newest'));
  }
}
