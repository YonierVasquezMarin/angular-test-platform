import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { mapListCountry, mergeDetail } from './country.mapper';
import { Country, RawCountry } from './models/country.model';
import { withSlugs } from './slug';

interface PopulationRow {
  countryiso3code?: string;
  value?: number | null;
}

type PopulationResponse = [unknown, PopulationRow[] | null];

let listRequest$: Observable<Country[]> | null = null;
const rawByCode = new Map<string, RawCountry>();

@Injectable({ providedIn: 'root' })
export class CountriesApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Country[]> {
    listRequest$ ??= loadCountries(this.http).pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return listRequest$;
  }

  getByCode(code: string): Observable<RawCountry> {
    const cached = rawByCode.get(code);
    if (cached) {
      return of(cached);
    }

    return this.getAll().pipe(
      map(() => {
        const found = rawByCode.get(code);
        if (!found) {
          throw new Error('No se encontró el país.');
        }
        return found;
      }),
    );
  }
}

function loadCountries(http: HttpClient): Observable<Country[]> {
  return forkJoin({
    countries: http.get<unknown>(environment.countriesUrl),
    population: http
      .get<PopulationResponse>(environment.populationUrl)
      .pipe(catchError(() => of(null))),
  }).pipe(
    map(({ countries, population }) => toCountries(countries, population)),
    catchError((error: unknown) => {
      listRequest$ = null;
      return throwError(() => error);
    }),
  );
}

function toCountries(countries: unknown, population: PopulationResponse | null): Country[] {
  if (!Array.isArray(countries)) {
    throw new Error('El servicio de países no devolvió un listado válido.');
  }

  const populations = new Map<string, number>();
  const rows = population?.[1];
  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (row.countryiso3code && typeof row.value === 'number') {
        populations.set(row.countryiso3code, row.value);
      }
    }
  }

  rawByCode.clear();
  const rawCountries = countries as RawCountry[];
  for (const country of rawCountries) {
    if (country?.cca3) {
      rawByCode.set(country.cca3, country);
    }
  }

  return withSlugs(rawCountries.filter((country) => country?.cca3 && country.name?.common)).map(
    (country) => mapListCountry(country, populations.get(country.cca3) ?? 0),
  );
}

export function applyDetail(base: Country, raw: RawCountry): Country {
  return mergeDetail(base, raw);
}
