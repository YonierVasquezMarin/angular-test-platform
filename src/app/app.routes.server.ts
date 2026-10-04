import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom } from 'rxjs';

import { CountriesApi } from './core/countries-api.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'favoritos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'planificar',
    renderMode: RenderMode.Client,
  },
  {
    path: 'paises/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const api = inject(CountriesApi);
      const countries = await firstValueFrom(api.getAll());
      return countries.map((country) => ({ slug: country.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
