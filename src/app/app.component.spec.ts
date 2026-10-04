import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';

import { App } from './app.component';
import { countriesFeature } from './state/countries/countries.reducer';
import { favoritesFeature } from './state/favorites/favorites.reducer';
import { travelNotesFeature } from './state/travel-notes/travel-notes.reducer';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideStore(),
        provideState(countriesFeature),
        provideState(favoritesFeature),
        provideState(travelNotesFeature),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el nombre del sitio y el enlace para saltar al contenido', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')?.textContent).toContain('Atlas de países');
    expect(compiled.querySelector('.skip-link')?.textContent).toContain('Saltar al contenido');
  });
});
