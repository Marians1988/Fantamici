import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AstaNotificationDTO } from '../assets/AstaNotificationDTO';
import { AuthService } from './auth-service';
import { NotificaEvent } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SseNotificheService {
  private readonly zone = inject(NgZone);
  private readonly authService = inject(AuthService)
  private activeEventSource: EventSource | null = null;

  public ascoltaNotifiche(legaId: number): Observable<NotificaEvent> {
    return new Observable(observer => {
      const token = this.authService.getToken(); // Recupera il JWT di Keycloak
      
      // 1. Chiude sempre una connessione precedente se era già aperta
      if (this.activeEventSource) {
        this.activeEventSource.close();
      }
      // Passaggio del token nell'URL
      const url = `http://localhost:8080/api/notifiche/stream/${legaId}?access_token=${token}`;
      this.activeEventSource = new EventSource(url);

      
      // Ascolta l'evento con nome "acquisto"
      this.activeEventSource.addEventListener('acquisto', (event: MessageEvent) => {
        this.zone.run(() => {
          const data: AstaNotificationDTO = JSON.parse(event.data);
          observer.next({type: 'ACQUISTO', payload: data});
        });
      });

      // 2. Listener per ELIMINAZIONE
      this.activeEventSource.addEventListener('eliminazione', (event: MessageEvent) => {
        this.zone.run(() => {
          const data: AstaNotificationDTO = JSON.parse(event.data);
          observer.next({ type: 'ELIMINAZIONE', payload: data });
        });
      });

      this.activeEventSource.addEventListener('INIT', (event: MessageEvent) => {
        this.zone.run(() => {
          console.log('Evento INIT ricevuto:', event.data);
        });
      });

      this.activeEventSource.onerror = (error) => {
        console.error('Errore SSE:', error);
        // EventSource tenta la riconnessione automatica per natura del browser
      };

      // Cleanup quando ci si annulla dall'Observable (unsubscribe / takeUntilDestroyed)
      // 2. Quando l'Observable fa l'unsubscribe, CHIUDE la connessione HTTP
      return () => this.chiudiConnessione();
    });

    
  }

  public chiudiConnessione(): void {
    if (this.activeEventSource) {
      this.activeEventSource.close();
      this.activeEventSource = null;
      console.log('Connessione SSE chiusa correttamente.');
    }
  }
}