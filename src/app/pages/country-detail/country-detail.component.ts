import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { heroFlagSrc } from '../../core/flags';
import { Country } from '../../core/models/country.model';
import { regionLabel } from '../../core/regions';
import { Seo } from '../../core/seo.service';
import { CountriesActions } from '../../state/countries/countries.actions';
import {
  selectAllCountries,
  selectDetailStatus,
  selectError,
} from '../../state/countries/countries.selectors';
import { FavoritesActions } from '../../state/favorites/favorites.actions';
import { selectFavoriteIds } from '../../state/favorites/favorites.selectors';
import { EmptyState } from '../../shared/empty-state/empty-state.component';
import { ErrorState } from '../../shared/error-state/error-state.component';
import { PopulationPipe } from '../../shared/population.pipe';
import { SkeletonList } from '../../shared/skeleton-list/skeleton-list.component';

@Component({
  selector: 'app-country-detail',
  imports: [NgOptimizedImage, RouterLink, EmptyState, ErrorState, PopulationPipe, SkeletonList],
  templateUrl: './country-detail.component.html',
})
export class CountryDetail {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(Seo);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: '' },
  );

  private readonly countries = this.store.selectSignal(selectAllCountries);
  private readonly favoriteIds = this.store.selectSignal(selectFavoriteIds);

  protected readonly detailStatus = this.store.selectSignal(selectDetailStatus);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly country = computed(
    () => this.countries().find((item) => item.slug === this.slug()) ?? null,
  );
  protected readonly isFavorite = computed(() => {
    const current = this.country();
    return current ? this.favoriteIds().includes(current.cca3) : false;
  });
  protected readonly flagSrc = computed(() => {
    const current = this.country();
    return current ? heroFlagSrc(current) : '';
  });
  protected readonly region = computed(() => {
    const current = this.country();
    return current ? regionLabel(current.region) : '';
  });
  protected readonly borders = computed(() => {
    const current = this.country();
    if (!current) {
      return [];
    }

    return current.borders
      .map((code) => this.countries().find((item) => item.cca3 === code))
      .filter((item): item is Country => item != null);
  });

  constructor() {
    effect(() => {
      const slug = this.slug();
      if (!slug) {
        return;
      }

      this.store.dispatch(CountriesActions.loadCountries());
      this.store.dispatch(CountriesActions.openCountry({ slug }));
    });

    effect(() => {
      const current = this.country();
      const status = this.detailStatus();

      if (current) {
        const description = `${current.name} (${current.officialName}). Capital: ${current.capital}. Región: ${regionLabel(current.region)}.`;
        this.seo.update({
          title: `${current.name} | Atlas de países`,
          description,
          path: `/paises/${current.slug}`,
          image: current.flagPng || undefined,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Country',
            name: current.name,
            alternateName: current.officialName,
            url: `${environment.siteUrl}/paises/${current.slug}`,
            image: current.flagPng || undefined,
          },
        });
        return;
      }

      if (status === 'missing') {
        this.seo.update({
          title: 'País no encontrado | Atlas de países',
          description: 'No hay un país con esa dirección en el atlas.',
          path: `/paises/${this.slug()}`,
          jsonLd: null,
        });
      }
    });
  }

  protected toggleFavorite(): void {
    const current = this.country();
    if (!current) {
      return;
    }

    const action = this.isFavorite()
      ? FavoritesActions.removeFavorite({ id: current.cca3 })
      : FavoritesActions.addFavorite({ id: current.cca3 });
    this.store.dispatch(action);
  }

  protected reload(): void {
    const slug = this.slug();
    this.store.dispatch(CountriesActions.loadCountries());
    if (slug) {
      this.store.dispatch(CountriesActions.openCountry({ slug }));
    }
  }
}
