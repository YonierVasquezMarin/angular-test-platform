import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Hydrate Favorites': emptyProps(),
    'Hydrate Favorites Success': props<{ ids: string[] }>(),
    'Add Favorite': props<{ id: string }>(),
    'Remove Favorite': props<{ id: string }>(),
  },
});
