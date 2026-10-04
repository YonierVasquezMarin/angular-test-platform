import { Country } from '../../core/models/country.model';
import { CountriesActions } from './countries.actions';
import { countriesReducer, initialCountriesState } from './countries.reducer';

describe('countriesReducer', () => {
  const colombia = country();

  it('guarda los países y marca la carga como completada', () => {
    const state = countriesReducer(
      initialCountriesState,
      CountriesActions.loadCountriesSuccess({ countries: [colombia] }),
    );

    expect(state.status).toBe('success');
    expect(state.ids).toEqual(['COL']);
    expect(state.entities['COL']?.slug).toBe('colombia');
  });

  it('conserva el listado si ya se cargó', () => {
    const loaded = countriesReducer(
      initialCountriesState,
      CountriesActions.loadCountriesSuccess({ countries: [colombia] }),
    );
    const state = countriesReducer(loaded, CountriesActions.loadCountries());

    expect(state.status).toBe('success');
    expect(state.ids).toEqual(['COL']);
  });

  it('guarda el error de carga', () => {
    const state = countriesReducer(
      { ...initialCountriesState, status: 'loading' },
      CountriesActions.loadCountriesFailure({ error: 'falló la red' }),
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('falló la red');
  });

  it('actualiza los filtros del listado', () => {
    const state = countriesReducer(
      initialCountriesState,
      CountriesActions.setListFilters({ region: 'americas', sort: 'poblacion' }),
    );

    expect(state.listRegion).toBe('americas');
    expect(state.listSort).toBe('poblacion');
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
