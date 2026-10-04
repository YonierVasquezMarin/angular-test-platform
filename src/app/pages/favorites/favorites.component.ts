import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Seo } from '../../core/seo.service';
import { CountriesActions } from '../../state/countries/countries.actions';
import { selectError, selectStatus } from '../../state/countries/countries.selectors';
import {
  selectFavoriteCountries,
  selectFavoritesHydrated,
} from '../../state/favorites/favorites.selectors';
import { CountryCard } from '../../shared/country-card/country-card.component';
import { EmptyState } from '../../shared/empty-state/empty-state.component';
import { ErrorState } from '../../shared/error-state/error-state.component';
import { SkeletonList } from '../../shared/skeleton-list/skeleton-list.component';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, CountryCard, EmptyState, ErrorState, SkeletonList],
  templateUrl: './favorites.component.html',
})
export class Favorites {
  private readonly store = inject(Store);

  protected readonly favorites = this.store.selectSignal(selectFavoriteCountries);
  protected readonly hydrated = this.store.selectSignal(selectFavoritesHydrated);
  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly resultLabel = computed(() => {
    const count = this.favorites().length;
    return count === 1 ? 'Tienes 1 país favorito.' : `Tienes ${count} países favoritos.`;
  });

  constructor() {
    this.store.dispatch(CountriesActions.loadCountries());
    inject(Seo).update({
      title: 'Favoritos | Atlas de países',
      description: 'Países que marcaste como favoritos en este navegador.',
      path: '/favoritos',
      robots: 'noindex, nofollow',
      jsonLd: null,
    });
  }

  protected reload(): void {
    this.store.dispatch(CountriesActions.loadCountries());
  }
}
