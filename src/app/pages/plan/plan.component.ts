import { DOCUMENT, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

import {
  REASON_LABELS,
  SEASON_LABELS,
  TRAVEL_REASONS,
  TRAVEL_SEASONS,
  TravelReason,
  TravelSeason,
} from '../../core/models/travel-note.model';
import { Seo } from '../../core/seo.service';
import { COMMENT_MAX, COMMENT_MIN, travelNoteCommentValidator } from '../../core/travel-note.validators';
import { CountriesActions } from '../../state/countries/countries.actions';
import { selectAllCountries, selectError, selectStatus } from '../../state/countries/countries.selectors';
import { TravelNotesActions } from '../../state/travel-notes/travel-notes.actions';
import {
  selectTravelNotes,
  selectTravelNotesHydrated,
} from '../../state/travel-notes/travel-notes.selectors';
import { ErrorState } from '../../shared/error-state/error-state.component';

@Component({
  selector: 'app-plan',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, ErrorState],
  templateUrl: './plan.component.html',
})
export class Plan {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private prefillApplied = false;

  protected readonly reasons = TRAVEL_REASONS;
  protected readonly seasons = TRAVEL_SEASONS;
  protected readonly reasonLabels = REASON_LABELS;
  protected readonly seasonLabels = SEASON_LABELS;
  protected readonly commentMin = COMMENT_MIN;
  protected readonly commentMax = COMMENT_MAX;
  protected readonly savedMessage = signal('');
  protected readonly countries = this.store.selectSignal(selectAllCountries);
  protected readonly notes = this.store.selectSignal(selectTravelNotes);
  protected readonly hydrated = this.store.selectSignal(selectTravelNotesHydrated);
  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly form = this.formBuilder.nonNullable.group(
    {
      countrySlug: ['', Validators.required],
      reason: ['' as TravelReason | '', Validators.required],
      season: ['' as TravelSeason | '', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(COMMENT_MIN), Validators.maxLength(COMMENT_MAX)]],
    },
    { validators: [travelNoteCommentValidator] },
  );

  constructor() {
    this.store.dispatch(CountriesActions.loadCountries());
    inject(Seo).update({
      title: 'Planificar un viaje | Atlas de países',
      description: 'Crea una nota de viaje con país, motivo, temporada y comentario.',
      path: '/planificar',
      robots: 'noindex, nofollow',
      jsonLd: null,
    });

    combineLatest([this.route.queryParamMap, toObservable(this.countries)])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, countries]) => {
        const slug = params.get('pais');
        if (!slug || this.prefillApplied || countries.length === 0) {
          return;
        }

        if (countries.some((country) => country.slug === slug)) {
          this.form.controls.countrySlug.setValue(slug);
          this.prefillApplied = true;
        }
      });
  }

  protected fieldError(name: 'countrySlug' | 'reason' | 'season' | 'comment'): string | null {
    const control = this.form.controls[name];
    const showGroupError = name === 'comment' && (control.touched || this.form.touched);
    if (showGroupError && this.form.hasError('commentTooShort')) {
      const error = this.form.getError('commentTooShort') as { requiredLength: number };
      return `Si el motivo es «otro», escribe al menos ${error.requiredLength} caracteres.`;
    }

    if (!control.touched) {
      return null;
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('minlength')) {
      const error = control.getError('minlength') as { requiredLength: number };
      return `Escribe al menos ${error.requiredLength} caracteres.`;
    }

    if (control.hasError('maxlength')) {
      const error = control.getError('maxlength') as { requiredLength: number };
      return `Usa como máximo ${error.requiredLength} caracteres.`;
    }

    return null;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.savedMessage.set('');
      setTimeout(() => this.focusFirstInvalid());
      return;
    }

    const raw = this.form.getRawValue();
    const country = this.countries().find((item) => item.slug === raw.countrySlug);
    if (!country || !isReason(raw.reason) || !isSeason(raw.season)) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(
      TravelNotesActions.addTravelNote({
        note: {
          id: createId(),
          countryCode: country.cca3,
          countrySlug: country.slug,
          countryName: country.name,
          reason: raw.reason,
          season: raw.season,
          comment: raw.comment.trim(),
          createdAt: new Date().toISOString(),
        },
      }),
    );
    this.savedMessage.set(`Nota guardada para ${country.name}.`);
    this.form.reset({ countrySlug: '', reason: '', season: '', comment: '' });
  }

  protected remove(id: string): void {
    this.store.dispatch(TravelNotesActions.removeTravelNote({ id }));
  }

  protected reload(): void {
    this.store.dispatch(CountriesActions.loadCountries());
  }

  private focusFirstInvalid(): void {
    const invalid = this.document.querySelector<HTMLElement>('#plan-form [aria-invalid="true"]');
    invalid?.focus();
  }
}

function isReason(value: string): value is TravelReason {
  return TRAVEL_REASONS.includes(value as TravelReason);
}

function isSeason(value: string): value is TravelSeason {
  return TRAVEL_SEASONS.includes(value as TravelSeason);
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `nota-${Date.now()}`;
}
