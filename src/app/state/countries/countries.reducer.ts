import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Country } from '../../core/models/country.model';
import { CountriesActions, CountrySort } from './countries.actions';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
export type DetailStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error';

export interface CountriesState extends EntityState<Country> {
  status: LoadStatus;
  error: string | null;
  detailStatus: DetailStatus;
  activeSlug: string;
  listRegion: string;
  listSort: CountrySort;
  searchName: string;
  searchRegion: string;
  searchMinPopulation: number;
}

export const countriesAdapter = createEntityAdapter<Country>({
  selectId: (country) => country.cca3,
});

export const initialCountriesState: CountriesState = countriesAdapter.getInitialState({
  status: 'idle',
  error: null,
  detailStatus: 'idle',
  activeSlug: '',
  listRegion: '',
  listSort: 'nombre',
  searchName: '',
  searchRegion: '',
  searchMinPopulation: 0,
});

export const countriesReducer = createReducer(
  initialCountriesState,
  on(CountriesActions.loadCountries, (state) =>
    state.status === 'success' ? state : { ...state, status: 'loading', error: null },
  ),
  on(CountriesActions.loadCountriesSuccess, (state, { countries }) =>
    countriesAdapter.setAll(countries, { ...state, status: 'success', error: null }),
  ),
  on(CountriesActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),
  on(CountriesActions.openCountry, (state, { slug }) => ({
    ...state,
    activeSlug: slug,
    detailStatus: 'loading',
    error: null,
  })),
  on(CountriesActions.loadCountryDetailSuccess, (state, { country }) =>
    countriesAdapter.upsertOne(country, { ...state, detailStatus: 'ready', error: null }),
  ),
  on(CountriesActions.countryNotFound, (state) => ({
    ...state,
    detailStatus: 'missing',
  })),
  on(CountriesActions.loadCountryDetailFailure, (state, { error }) => ({
    ...state,
    detailStatus: 'error',
    error,
  })),
  on(CountriesActions.setListFilters, (state, { region, sort }) => ({
    ...state,
    listRegion: region,
    listSort: sort,
  })),
  on(CountriesActions.setSearchFilters, (state, { name, region, minPopulation }) => ({
    ...state,
    searchName: name,
    searchRegion: region,
    searchMinPopulation: minPopulation,
  })),
);

export const countriesFeature = createFeature({
  name: 'countries',
  reducer: countriesReducer,
  extraSelectors: ({
    selectCountriesState,
    selectListRegion,
    selectListSort,
    selectSearchName,
    selectSearchRegion,
    selectSearchMinPopulation,
  }) => {
    const { selectAll } = countriesAdapter.getSelectors(selectCountriesState);

    const selectListCountries = createSelector(
      selectAll,
      selectListRegion,
      selectListSort,
      (countries, region, sort) => sortCountries(filterByRegion(countries, region), sort),
    );

    const selectSearchResults = createSelector(
      selectAll,
      selectSearchName,
      selectSearchRegion,
      selectSearchMinPopulation,
      (countries, name, region, minPopulation) =>
        sortCountries(filterBySearch(countries, name, region, minPopulation), 'nombre'),
    );

    const selectFeaturedCountries = createSelector(selectAll, (countries) =>
      [...countries].sort((a, b) => b.population - a.population).slice(0, 6),
    );

    return {
      selectAllCountries: selectAll,
      selectListCountries,
      selectSearchResults,
      selectFeaturedCountries,
    };
  },
});

function filterByRegion(countries: Country[], region: string): Country[] {
  if (!region) {
    return countries;
  }

  const normalized = region.toLowerCase();
  return countries.filter((country) => country.region.toLowerCase() === normalized);
}

function filterBySearch(
  countries: Country[],
  name: string,
  region: string,
  minPopulation: number,
): Country[] {
  const query = name.trim().toLocaleLowerCase('es');

  return filterByRegion(countries, region).filter((country) => {
    const matchesName =
      !query ||
      country.name.toLocaleLowerCase('es').includes(query) ||
      country.officialName.toLocaleLowerCase('es').includes(query);
    const matchesPopulation = minPopulation <= 0 || country.population >= minPopulation;
    return matchesName && matchesPopulation;
  });
}

function sortCountries(countries: Country[], sort: CountrySort): Country[] {
  return [...countries].sort((a, b) => {
    if (sort === 'poblacion') {
      return b.population - a.population;
    }

    return a.name.localeCompare(b.name, 'es');
  });
}
