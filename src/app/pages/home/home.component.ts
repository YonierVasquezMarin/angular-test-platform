import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { REGIONS } from '../../core/regions';
import { Seo } from '../../core/seo.service';
import { CountriesActions } from '../../state/countries/countries.actions';
import {
  selectError,
  selectFeaturedCountries,
  selectStatus,
} from '../../state/countries/countries.selectors';
import { CountryCard } from '../../shared/country-card/country-card.component';
import { ErrorState } from '../../shared/error-state/error-state.component';
import { SkeletonList } from '../../shared/skeleton-list/skeleton-list.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CountryCard, ErrorState, SkeletonList],
  templateUrl: './home.component.html',
})
export class Home {
  private readonly store = inject(Store);
  private readonly seo = inject(Seo);

  protected readonly regions = REGIONS;
  protected readonly featured = this.store.selectSignal(selectFeaturedCountries);
  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly error = this.store.selectSignal(selectError);

  constructor() {
    this.store.dispatch(CountriesActions.loadCountries());
    this.seo.update({
      title: 'Atlas de países',
      description:
        'Consulta capitales, población y regiones de los países del mundo y guarda tus favoritos o notas de viaje.',
      path: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Atlas de países',
        url: environment.siteUrl,
        description:
          'Explorador de países con fichas, búsqueda, favoritos y notas de viaje.',
      },
    });

    effect(() => {
      const countries = this.featured();
      if (this.status() !== 'success' || countries.length === 0) {
        return;
      }

      this.seo.update({
        title: 'Atlas de países',
        description:
          'Consulta capitales, población y regiones de los países del mundo y guarda tus favoritos o notas de viaje.',
        path: '/',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Países destacados',
          itemListElement: countries.map((country, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: country.name,
            url: `${environment.siteUrl}/paises/${country.slug}`,
          })),
        },
      });
    });
  }

  protected reload(): void {
    this.store.dispatch(CountriesActions.loadCountries());
  }
}
