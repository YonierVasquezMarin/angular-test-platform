import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const COMMENT_MIN = 20;
export const COMMENT_MAX = 500;
export const OTHER_COMMENT_MIN = 40;

export const travelNoteCommentValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const reason = control.get('reason')?.value;
  const comment = String(control.get('comment')?.value ?? '').trim();

  if (reason !== 'otro' || comment.length >= OTHER_COMMENT_MIN) {
    return null;
  }

  return {
    commentTooShort: {
      requiredLength: OTHER_COMMENT_MIN,
      actualLength: comment.length,
    },
  };
};
