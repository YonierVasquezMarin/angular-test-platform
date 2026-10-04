import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Country } from '../../core/models/country.model';

export type CountrySort = 'nombre' | 'poblacion';

export const CountriesActions = createActionGroup({
  source: 'Countries',
  events: {
    'Load Countries': emptyProps(),
    'Load Countries Success': props<{ countries: Country[] }>(),
    'Load Countries Failure': props<{ error: string }>(),
    'Open Country': props<{ slug: string }>(),
    'Load Country Detail Success': props<{ country: Country }>(),
    'Country Not Found': props<{ slug: string }>(),
    'Load Country Detail Failure': props<{ error: string }>(),
    'Set List Filters': props<{ region: string; sort: CountrySort }>(),
    'Set Search Filters': props<{ name: string; region: string; minPopulation: number }>(),
  },
});
