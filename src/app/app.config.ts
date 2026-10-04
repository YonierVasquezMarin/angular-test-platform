import { registerLocaleData } from '@angular/common';
import {
  ɵHTTP_FETCH_MAX_RESPONSE_SIZE,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import {
  ApplicationConfig,
  LOCALE_ID,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { errorInterceptor } from './core/error.interceptor';
import { CountriesEffects } from './state/countries/countries.effects';
import { countriesFeature } from './state/countries/countries.reducer';
import { FavoritesEffects } from './state/favorites/favorites.effects';
import { favoritesFeature } from './state/favorites/favorites.reducer';
import { TravelNotesEffects } from './state/travel-notes/travel-notes.effects';
import { travelNotesFeature } from './state/travel-notes/travel-notes.reducer';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    { provide: LOCALE_ID, useValue: 'es' },
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    // El dataset de países supera el límite de 1 MB de HttpClient en el servidor.
    { provide: ɵHTTP_FETCH_MAX_RESPONSE_SIZE, useValue: 8 * 1024 * 1024 },
    provideStore(),
    provideState(countriesFeature),
    provideState(favoritesFeature),
    provideState(travelNotesFeature),
    provideEffects([CountriesEffects, FavoritesEffects, TravelNotesEffects]),
    ...(isDevMode()
      ? [provideStoreDevtools({ maxAge: 25, name: 'Atlas de países', connectInZone: false })]
      : []),
  ],
};
