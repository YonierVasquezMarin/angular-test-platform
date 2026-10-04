import { Component, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { REGIONS } from '../../core/regions';
import { Seo } from '../../core/seo.service';
import { CountrySort, CountriesActions } from '../../state/countries/countries.actions';
import {
  selectError,
  selectListCountries,
  selectListRegion,
  selectListSort,
  selectStatus,
} from '../../state/countries/countries.selectors';
import { CountryCard } from '../../shared/country-card/country-card.component';
import { EmptyState } from '../../shared/empty-state/empty-state.component';
import { ErrorState } from '../../shared/error-state/error-state.component';
import { SkeletonList } from '../../shared/skeleton-list/skeleton-list.component';

@Component({
  selector: 'app-country-list',
  imports: [RouterLink, CountryCard, EmptyState, ErrorState, SkeletonList],
  templateUrl: './country-list.component.html',
})
export class CountryList {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(Seo);

  protected readonly regions = REGIONS;
  protected readonly countries = this.store.selectSignal(selectListCountries);
  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly region = this.store.selectSignal(selectListRegion);
  protected readonly sort = this.store.selectSignal(selectListSort);
  protected readonly resultLabel = computed(() => {
    const count = this.countries().length;
    return count === 1 ? 'Se muestra 1 país.' : `Se muestran ${count} países.`;
  });

  constructor() {
    this.store.dispatch(CountriesActions.loadCountries());
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const region = params.get('region') ?? '';
      const sort: CountrySort = params.get('orden') === 'poblacion' ? 'poblacion' : 'nombre';
      this.store.dispatch(CountriesActions.setListFilters({ region, sort }));
    });

    effect(() => {
      const region = this.region();
      const countries = this.countries();
      const regionName = REGIONS.find((item) => item.slug === region)?.label;
      this.seo.update({
        title: regionName
          ? `Países de ${regionName} | Atlas de países`
          : 'Listado de países | Atlas de países',
        description: regionName
          ? `Países de ${regionName} con bandera, capital y población.`
          : 'Listado de países con bandera, capital y población. Filtra por región y ordena por nombre o habitantes.',
        path: region ? `/paises?region=${region}` : '/paises',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: regionName ? `Países de ${regionName}` : 'Listado de países',
          itemListElement: countries.slice(0, 24).map((country, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: country.name,
            url: `${environment.siteUrl}/paises/${country.slug}`,
          })),
        },
      });
    });
  }

  protected sortQuery(sort: CountrySort): Record<string, string | null> {
    return {
      region: this.region() || null,
      orden: sort === 'poblacion' ? 'poblacion' : null,
    };
  }

  protected regionQuery(region: string | null): Record<string, string | null> {
    return {
      region,
      orden: this.sort() === 'poblacion' ? 'poblacion' : null,
    };
  }

  protected reload(): void {
    this.store.dispatch(CountriesActions.loadCountries());
  }
}
