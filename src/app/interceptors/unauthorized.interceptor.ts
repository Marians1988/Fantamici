import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../shared-service/auth-service';


export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Sessione scaduta o Token non valido (401). Chiusura connessioni e logout...');

        const authService = injector.get(AuthService);
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};