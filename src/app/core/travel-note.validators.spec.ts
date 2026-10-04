import { FormControl, FormGroup } from '@angular/forms';

import { travelNoteCommentValidator } from './travel-note.validators';

describe('travelNoteCommentValidator', () => {
  it('exige 40 caracteres cuando el motivo es otro', () => {
    const group = new FormGroup({
      reason: new FormControl('otro'),
      comment: new FormControl('muy corto'),
    });

    expect(travelNoteCommentValidator(group)).toEqual({
      commentTooShort: { requiredLength: 40, actualLength: 9 },
    });
  });

  it('acepta un comentario de 40 caracteres para el motivo otro', () => {
    const group = new FormGroup({
      reason: new FormControl('otro'),
      comment: new FormControl('a'.repeat(40)),
    });

    expect(travelNoteCommentValidator(group)).toBeNull();
  });

  it('no añade la regla extra si el motivo no es otro', () => {
    const group = new FormGroup({
      reason: new FormControl('turismo'),
      comment: new FormControl('corto'),
    });

    expect(travelNoteCommentValidator(group)).toBeNull();
  });
});
