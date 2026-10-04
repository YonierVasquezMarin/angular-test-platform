import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message =
          error.status === 0
            ? 'No se pudo conectar con el servicio de países.'
            : `El servicio de países respondió con un error (${error.status}).`;
        return throwError(() => new Error(message));
      }

      return throwError(() =>
        error instanceof Error ? error : new Error('Ocurrió un error inesperado al consultar los países.'),
      );
    }),
  );
