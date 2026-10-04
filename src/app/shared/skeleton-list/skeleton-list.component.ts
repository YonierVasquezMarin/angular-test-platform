import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-list',
  templateUrl: './skeleton-list.component.html',
})
export class SkeletonList {
  readonly count = input(6);
  protected readonly items = computed(() => Array.from({ length: this.count() }, (_, index) => index));
}
