import { createFeature, createReducer, on } from '@ngrx/store';

import { FavoritesActions } from './favorites.actions';

export interface FavoritesState {
  ids: string[];
  hydrated: boolean;
}

export const initialFavoritesState: FavoritesState = {
  ids: [],
  hydrated: false,
};

export const favoritesReducer = createReducer(
  initialFavoritesState,
  on(FavoritesActions.hydrateFavoritesSuccess, (state, { ids }) => ({
    ...state,
    ids,
    hydrated: true,
  })),
  on(FavoritesActions.addFavorite, (state, { id }) =>
    state.ids.includes(id) ? state : { ...state, ids: [id, ...state.ids] },
  ),
  on(FavoritesActions.removeFavorite, (state, { id }) => ({
    ...state,
    ids: state.ids.filter((item) => item !== id),
  })),
);

export const favoritesFeature = createFeature({
  name: 'favorites',
  reducer: favoritesReducer,
});
