import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { REGIONS } from '../../core/regions';
import { Seo } from '../../core/seo.service';
import { CountriesActions } from '../../state/countries/countries.actions';
import {
  selectError,
  selectSearchMinPopulation,
  selectSearchName,
  selectSearchRegion,
  selectSearchResults,
  selectStatus,
} from '../../state/countries/countries.selectors';
import { CountryCard } from '../../shared/country-card/country-card.component';
import { EmptyState } from '../../shared/empty-state/empty-state.component';
import { ErrorState } from '../../shared/error-state/error-state.component';
import { SkeletonList } from '../../shared/skeleton-list/skeleton-list.component';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CountryCard, EmptyState, ErrorState, SkeletonList],
  templateUrl: './search.component.html',
})
export class Search {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly seo = inject(Seo);

  protected readonly regions = REGIONS;
  protected readonly form = this.formBuilder.nonNullable.group({
    name: [''],
    region: [''],
    minPopulation: [0, Validators.min(0)],
  });
  protected readonly results = this.store.selectSignal(selectSearchResults);
  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly searchName = this.store.selectSignal(selectSearchName);
  protected readonly searchRegion = this.store.selectSignal(selectSearchRegion);
  protected readonly minPopulation = this.store.selectSignal(selectSearchMinPopulation);
  protected readonly hasCriteria = computed(
    () =>
      this.searchName().trim().length > 0 || this.searchRegion().length > 0 || this.minPopulation() > 0,
  );
  protected readonly resultLabel = computed(() => {
    const count = this.results().length;
    return count === 1 ? 'Se encontró 1 país.' : `Se encontraron ${count} países.`;
  });

  constructor() {
    this.store.dispatch(CountriesActions.loadCountries());
    this.seo.update({
      title: 'Buscar países | Atlas de países',
      description: 'Busca países por nombre, región y población mínima.',
      path: '/buscar',
      jsonLd: null,
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const next = {
        name: params.get('nombre') ?? '',
        region: params.get('region') ?? '',
        minPopulation: positiveNumber(params.get('poblacion')),
      };
      const current = this.form.getRawValue();
      if (
        current.name === next.name &&
        current.region === next.region &&
        current.minPopulation === next.minPopulation
      ) {
        this.store.dispatch(CountriesActions.setSearchFilters(next));
        return;
      }

      this.form.setValue(next, { emitEvent: false });
      this.store.dispatch(CountriesActions.setSearchFilters(next));
    });

    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (previous, current) =>
            previous.name === current.name &&
            previous.region === current.region &&
            previous.minPopulation === current.minPopulation,
        ),
        filter(() => this.form.valid),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        const filters = {
          name: value.name ?? '',
          region: value.region ?? '',
          minPopulation: positiveNumber(value.minPopulation),
        };
        this.store.dispatch(CountriesActions.setSearchFilters(filters));
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            nombre: filters.name || null,
            region: filters.region || null,
            poblacion: filters.minPopulation > 0 ? filters.minPopulation : null,
          },
          replaceUrl: true,
        });
      });
  }

  protected reload(): void {
    this.store.dispatch(CountriesActions.loadCountries());
  }
}

function positiveNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
