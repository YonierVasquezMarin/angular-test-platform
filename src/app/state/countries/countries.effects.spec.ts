import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideState, provideStore } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject } from 'rxjs';

import { Country } from '../../core/models/country.model';
import { CountriesApi } from '../../core/countries-api.service';
import { CountriesActions } from './countries.actions';
import { CountriesEffects } from './countries.effects';
import { countriesFeature } from './countries.reducer';

describe('CountriesEffects', () => {
  let actions$: Subject<Action>;
  let effects: CountriesEffects;
  const api = {
    getAll: vi.fn(),
    getByCode: vi.fn(),
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    api.getAll.mockReset();
    TestBed.configureTestingModule({
      providers: [
        CountriesEffects,
        provideMockActions(() => actions$),
        provideStore(),
        provideState(countriesFeature),
        { provide: CountriesApi, useValue: api },
      ],
    });
    effects = TestBed.inject(CountriesEffects);
  });

  it('carga los países con switch de éxito', async () => {
    const colombia = country();
    api.getAll.mockReturnValue(of([colombia]));

    const pending = firstValueFrom(effects.loadCountries$);
    actions$.next(CountriesActions.loadCountries());

    await expect(pending).resolves.toEqual(
      CountriesActions.loadCountriesSuccess({ countries: [colombia] }),
    );
  });
});

function country(): Country {
  return {
    cca3: 'COL',
    cca2: 'CO',
    slug: 'colombia',
    name: 'Colombia',
    officialName: 'República de Colombia',
    capital: 'Bogotá',
    region: 'Americas',
    subregion: 'South America',
    population: 50882884,
    area: 1141748,
    flagPng: 'https://flagcdn.com/w320/co.png',
    flagAlt: 'Bandera de Colombia',
    currencies: [],
    languages: [],
    borders: [],
    mapUrl: '',
    detailLoaded: false,
  };
}
