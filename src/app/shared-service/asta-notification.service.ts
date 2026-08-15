import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { SseNotificheService } from './sse-notifiche.service';
import { AstaNotificationDTO } from '../assets/AstaNotificationDTO';
import { NotificaAcquistoDialogComponent } from '../utility-class/notifica-acquisto-dialog.component';
import { NotificaEvent } from '../models/models';

@Injectable({
  providedIn: 'root' // Disponibile in tutta l'app
})
export class AstaNotificationService {
  private readonly sseService = inject(SseNotificheService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  private legaIdAttiva: number | null = null;

  /**
   * Avvia l'iscrizione alle notifiche SSE per la lega specificata
   */
  public iscrivitiAlleNotifiche(legaId: number): void {
    // Evita di rieseguire l'iscrizione se è già attivo sullo stesso legaId
    if (this.legaIdAttiva === legaId) return;
    this.legaIdAttiva = legaId;

    this.sseService.ascoltaNotifiche(legaId)
      .pipe(
        // Annulla automaticamente la sottoscrizione alla distruzione del contesto
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({type ,payload}) => {
          this.apriDialogNotifica({type ,payload});
        },
        error: (err) => {
          console.error('Errore durante la ricezione notifica SSE:', err);
        }
      });
  }

  private apriDialogNotifica(notifica: NotificaEvent): void {
    this.dialog.open(NotificaAcquistoDialogComponent, {
      width: '400px',
      data: notifica,
      autoFocus: true,
      panelClass: 'notifica-dialog-container'
    });
  }
}