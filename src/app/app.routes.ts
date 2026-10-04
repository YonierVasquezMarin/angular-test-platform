import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.Home),
    title: 'Atlas de países',
  },
  {
    path: 'paises',
    loadComponent: () => import('./pages/country-list/country-list.component').then((m) => m.CountryList),
    title: 'Listado de países | Atlas de países',
  },
  {
    path: 'paises/:slug',
    loadComponent: () =>
      import('./pages/country-detail/country-detail.component').then((m) => m.CountryDetail),
    title: 'País | Atlas de países',
  },
  {
    path: 'buscar',
    loadComponent: () => import('./pages/search/search.component').then((m) => m.Search),
    title: 'Buscar países | Atlas de países',
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favorites/favorites.component').then((m) => m.Favorites),
    title: 'Favoritos | Atlas de países',
  },
  {
    path: 'planificar',
    loadComponent: () => import('./pages/plan/plan.component').then((m) => m.Plan),
    title: 'Planificar un viaje | Atlas de países',
  },
  {
    path: 'acerca',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.About),
    title: 'Acerca de | Atlas de países',
  },
  { path: '**', redirectTo: '' },
];
