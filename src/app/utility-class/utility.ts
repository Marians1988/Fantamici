import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: HttpErrorResponse): string {
  if (!err.error) {
    return 'Errore di comunicazione con il server.';
  }

  try {
    const errorBody = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
    return errorBody.message || 'Errore sconosciuto.';
  } catch {
    return typeof err.error === 'string' ? err.error : 'Errore durante l\'elaborazione della risposta.';
  }
}