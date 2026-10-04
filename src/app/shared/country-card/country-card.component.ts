import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { cardFlagSrc } from '../../core/flags';
import { Country } from '../../core/models/country.model';
import { regionLabel } from '../../core/regions';
import { FavoritesActions } from '../../state/favorites/favorites.actions';
import { selectFavoriteIds } from '../../state/favorites/favorites.selectors';
import { PopulationPipe } from '../population.pipe';

@Component({
  selector: 'app-country-card',
  imports: [NgOptimizedImage, RouterLink, PopulationPipe],
  templateUrl: './country-card.component.html',
})
export class CountryCard {
  readonly country = input.required<Country>();

  private readonly store = inject(Store);
  private readonly favoriteIds = this.store.selectSignal(selectFavoriteIds);

  protected readonly isFavorite = computed(() => this.favoriteIds().includes(this.country().cca3));
  protected readonly flagSrc = computed(() => cardFlagSrc(this.country()));
  protected readonly region = computed(() => regionLabel(this.country().region));

  protected toggleFavorite(): void {
    const id = this.country().cca3;
    const action = this.isFavorite()
      ? FavoritesActions.removeFavorite({ id })
      : FavoritesActions.addFavorite({ id });
    this.store.dispatch(action);
  }
}
