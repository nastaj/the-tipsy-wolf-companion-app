import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-star-rating',
  imports: [IonIcon],
  template: `
    <span class="inline-flex items-center gap-0.5 text-accent" role="img" [attr.aria-label]="label()">
      @for (filled of stars(); track $index) {
        <ion-icon aria-hidden="true" [name]="filled ? 'star' : 'star-outline'" [class]="sizeClass()" />
      }
    </span>
  `,
})
export class StarRatingComponent {
  readonly rating = input.required<number>();
  readonly sizeClass = input('text-sm');

  protected readonly stars = computed(() => {
    const filled = Math.round(this.rating());
    return [1, 2, 3, 4, 5].map((n) => n <= filled);
  });
  protected readonly label = computed(() => `${Math.round(this.rating() * 10) / 10} out of 5 stars`);
}
