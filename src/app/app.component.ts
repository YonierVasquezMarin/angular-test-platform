import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { Footer } from './shared/footer/footer.component';
import { Header } from './shared/header/header.component';
import { FavoritesActions } from './state/favorites/favorites.actions';
import { TravelNotesActions } from './state/travel-notes/travel-notes.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.component.html',
})
export class App {
  private readonly store = inject(Store);

  constructor() {
    afterNextRender(() => {
      this.store.dispatch(FavoritesActions.hydrateFavorites());
      this.store.dispatch(TravelNotesActions.hydrateTravelNotes());
    });
  }
}
