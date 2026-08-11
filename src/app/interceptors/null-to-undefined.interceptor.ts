import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const nullToUndefinedInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        console.log('1. INTERCEPTOR - Valore originale:', event.body);
        
        if (event.body === null) {
          // Creiamo un nuovo HttpResponse copiando i dati ma forzando il body a undefined
          const modificato = new HttpResponse({
            body: undefined, // Forza undefined
            headers: event.headers,
            status: event.status,
            statusText: event.statusText,
            url: event.url || undefined
          });

          console.log('2. INTERCEPTOR - Valore modificato:', modificato.body);
          return modificato;
        }
      }
      return event;
    })
  );
};