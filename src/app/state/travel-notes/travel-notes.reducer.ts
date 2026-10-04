import { createFeature, createReducer, on } from '@ngrx/store';

import { TravelNote } from '../../core/models/travel-note.model';
import { TravelNotesActions } from './travel-notes.actions';

export interface TravelNotesState {
  notes: TravelNote[];
  hydrated: boolean;
}

export const initialTravelNotesState: TravelNotesState = {
  notes: [],
  hydrated: false,
};

export const travelNotesReducer = createReducer(
  initialTravelNotesState,
  on(TravelNotesActions.hydrateTravelNotesSuccess, (state, { notes }) => ({
    ...state,
    notes,
    hydrated: true,
  })),
  on(TravelNotesActions.addTravelNote, (state, { note }) => ({
    ...state,
    notes: [note, ...state.notes],
  })),
  on(TravelNotesActions.removeTravelNote, (state, { id }) => ({
    ...state,
    notes: state.notes.filter((note) => note.id !== id),
  })),
);

export const travelNotesFeature = createFeature({
  name: 'travelNotes',
  reducer: travelNotesReducer,
});
