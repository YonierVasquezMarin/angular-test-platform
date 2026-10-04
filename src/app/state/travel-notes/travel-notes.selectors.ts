import { travelNotesFeature } from './travel-notes.reducer';

export const { selectNotes: selectTravelNotes, selectHydrated: selectTravelNotesHydrated } =
  travelNotesFeature;
