import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import { TRAVEL_REASONS, TRAVEL_SEASONS, TravelNote } from '../../core/models/travel-note.model';
import { TravelNotesActions } from './travel-notes.actions';
import { selectTravelNotes } from './travel-notes.selectors';

export const TRAVEL_NOTES_STORAGE_KEY = 'atlas.travel-notes';

@Injectable()
export class TravelNotesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);

  hydrateTravelNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TravelNotesActions.hydrateTravelNotes),
      map(() =>
        TravelNotesActions.hydrateTravelNotesSuccess({ notes: readTravelNotes(this.platformId) }),
      ),
    ),
  );

  persistTravelNotes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TravelNotesActions.addTravelNote, TravelNotesActions.removeTravelNote),
        withLatestFrom(this.store.select(selectTravelNotes)),
        tap(([, notes]) => {
          if (!isPlatformBrowser(this.platformId)) {
            return;
          }

          localStorage.setItem(TRAVEL_NOTES_STORAGE_KEY, JSON.stringify(notes));
        }),
      ),
    { dispatch: false },
  );
}

function readTravelNotes(platformId: object): TravelNote[] {
  if (!isPlatformBrowser(platformId)) {
    return [];
  }

  try {
    const raw = localStorage.getItem(TRAVEL_NOTES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTravelNote);
  } catch {
    return [];
  }
}

function isTravelNote(value: unknown): value is TravelNote {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const note = value as TravelNote;
  return (
    typeof note.id === 'string' &&
    typeof note.countryCode === 'string' &&
    typeof note.countrySlug === 'string' &&
    typeof note.countryName === 'string' &&
    TRAVEL_REASONS.includes(note.reason) &&
    TRAVEL_SEASONS.includes(note.season) &&
    typeof note.comment === 'string' &&
    typeof note.createdAt === 'string'
  );
}
