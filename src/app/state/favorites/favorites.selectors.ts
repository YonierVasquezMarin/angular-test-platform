import { createSelector } from '@ngrx/store';

import { Country } from '../../core/models/country.model';
import { selectAllCountries } from '../countries/countries.selectors';
import { favoritesFeature } from './favorites.reducer';

export const { selectIds: selectFavoriteIds, selectHydrated: selectFavoritesHydrated } =
  favoritesFeature;

export const selectFavoriteCountries = createSelector(
  selectAllCountries,
  selectFavoriteIds,
  (countries, ids): Country[] =>
    ids
      .map((id) => countries.find((country) => country.cca3 === id))
      .filter((country): country is Country => country != null),
);
