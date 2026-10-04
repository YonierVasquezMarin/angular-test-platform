import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { CountriesApi, applyDetail } from '../../core/countries-api.service';
import { toErrorMessage } from '../../core/error-message';
import { CountriesActions } from './countries.actions';
import { selectAllCountries, selectStatus } from './countries.selectors';

@Injectable()
export class CountriesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(CountriesApi);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.loadCountries),
      withLatestFrom(this.store.select(selectStatus)),
      filter(([, status]) => status !== 'success'),
      exhaustMap(() =>
        this.api.getAll().pipe(
          map((countries) => CountriesActions.loadCountriesSuccess({ countries })),
          catchError((error: unknown) =>
            of(CountriesActions.loadCountriesFailure({ error: toErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  openCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.openCountry),
      switchMap(({ slug }) =>
        this.store.select(selectStatus).pipe(
          filter((status) => status === 'success' || status === 'error'),
          take(1),
          switchMap((status) => {
            if (status === 'error') {
              return of(
                CountriesActions.loadCountryDetailFailure({
                  error: 'No se pudo cargar el listado de países.',
                }),
              );
            }

            return this.store.select(selectAllCountries).pipe(
              take(1),
              switchMap((countries) => {
                const country = countries.find((item) => item.slug === slug);
                if (!country) {
                  return of(CountriesActions.countryNotFound({ slug }));
                }

                if (country.detailLoaded) {
                  return of(CountriesActions.loadCountryDetailSuccess({ country }));
                }

                return this.api.getByCode(country.cca3).pipe(
                  map((detail) =>
                    CountriesActions.loadCountryDetailSuccess({
                      country: applyDetail(country, detail),
                    }),
                  ),
                  catchError((error: unknown) =>
                    of(
                      CountriesActions.loadCountryDetailFailure({
                        error: toErrorMessage(error),
                      }),
                    ),
                  ),
                );
              }),
            );
          }),
        ),
      ),
    ),
  );
}
