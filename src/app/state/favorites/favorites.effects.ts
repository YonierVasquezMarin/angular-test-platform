import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import { FavoritesActions } from './favorites.actions';
import { selectFavoriteIds } from './favorites.selectors';

export const FAVORITES_STORAGE_KEY = 'atlas.favorites';

@Injectable()
export class FavoritesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);

  hydrateFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.hydrateFavorites),
      map(() => FavoritesActions.hydrateFavoritesSuccess({ ids: readFavoriteIds(this.platformId) })),
    ),
  );

  persistFavorites$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FavoritesActions.addFavorite, FavoritesActions.removeFavorite),
        withLatestFrom(this.store.select(selectFavoriteIds)),
        tap(([, ids]) => {
          if (!isPlatformBrowser(this.platformId)) {
            return;
          }

          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
        }),
      ),
    { dispatch: false },
  );
}

function readFavoriteIds(platformId: object): string[] {
  if (!isPlatformBrowser(platformId)) {
    return [];
  }

  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}
