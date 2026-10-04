import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TravelNote } from '../../core/models/travel-note.model';

export const TravelNotesActions = createActionGroup({
  source: 'Travel Notes',
  events: {
    'Hydrate Travel Notes': emptyProps(),
    'Hydrate Travel Notes Success': props<{ notes: TravelNote[] }>(),
    'Add Travel Note': props<{ note: TravelNote }>(),
    'Remove Travel Note': props<{ id: string }>(),
  },
});
