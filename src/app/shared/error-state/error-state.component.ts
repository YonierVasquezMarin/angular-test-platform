import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
})
export class ErrorState {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
