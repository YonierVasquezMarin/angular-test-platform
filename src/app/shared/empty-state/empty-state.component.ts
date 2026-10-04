import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}
