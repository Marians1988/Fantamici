import { Component, inject, OnDestroy} from '@angular/core';
import { mergeMap, Subject, takeUntil} from 'rxjs';
import { LegaService } from '../../shared-service/lega.service';
import {MatChipsModule} from '@angular/material/chips';
import { FormazioneAppComponent } from './formazione/formazione-app.component';
import { Calciatore } from '../../models/models';
import { AssegnazioneAstaDTO } from '../../assets/AssegnazioneAstaDTO';

@Component({
  selector: 'app-rose-details-app-component',
  imports: [MatChipsModule,FormazioneAppComponent],
  templateUrl: './rose-details-app.component.html',
  styleUrl: './rose-details-app.component.scss',
})
export class RoseDetailsAppComponent implements OnDestroy {
  
  readonly legaService = inject(LegaService);
  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }

  handleEliminaGiocatore(event: { rosaId: number; giocatoreId: number }): void {
    // const rosa = this.rose.find(r => r.id === event.rosaId);
    // if (rosa) {
    //   rosa.giocatori = rosa.giocatori.filter(g => g.id !== event.giocatoreId);
    // }
  }

  handleAggiungiGiocatore(newCalciatore: Calciatore): void {
    const{nome, cognome, prezzoPagato, ruolo, squadraId = 0} = newCalciatore || {};
    const astaAssegnazione: AssegnazioneAstaDTO = {
      nome,cognome,prezzoPagato,ruolo,squadraId
    }
    this.legaService.aggiungiGiocatore(astaAssegnazione)
    .pipe(
      mergeMap(()=> this.legaService.getRose(this.legaService.getLegaResponseDTO()?.id || 0)),
      takeUntil(this.destroy$)
    )
    .subscribe({
          next: (roseData) => {
            const { rose = [] } = roseData;
            this.legaService.setRosaSquadraDTO(rose);
          },
          error: (err) => {
            console.error('Errore durante il salvataggio del nuovo giocatore:', err);
          }
    });
   }
}