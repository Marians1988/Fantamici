import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from '../shared-service/auth-service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);
  
  const token = authService.getToken(); 

  // Se il token esiste, cloniamo la richiesta inserendo l'header Bearer
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Passiamo la richiesta modificata al prossimo anello della catena
    return next(clonedRequest);
  }

  // Se non c'è alcun token (es. durante il login iniziale), lasciamo andare la richiesta originale
  return next(req);
};