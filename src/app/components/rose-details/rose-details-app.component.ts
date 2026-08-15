import { Component, inject, OnDestroy} from '@angular/core';
import { catchError, EMPTY, mergeMap, Subject, takeUntil, throwError} from 'rxjs';
import { LegaService } from '../../shared-service/lega.service';
import {MatChipsModule} from '@angular/material/chips';
import { FormazioneAppComponent } from './formazione/formazione-app.component';
import { Calciatore } from '../../models/models';
import { AssegnazioneAstaDTO } from '../../assets/AssegnazioneAstaDTO';
import { DialogData, GenericDialogComponent } from '../dialogs/generic-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared-service/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { extractErrorMessage } from '../../utility-class/utility';

@Component({
  selector: 'app-rose-details-app-component',
  imports: [MatChipsModule,FormazioneAppComponent,MatIcon],
  templateUrl: './rose-details-app.component.html',
  styleUrl: './rose-details-app.component.scss',
})
export class RoseDetailsAppComponent implements OnDestroy {
  
  private readonly dialog = inject(MatDialog);
  readonly legaService = inject(LegaService);
  readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();
  private readonly snackBar = inject(MatSnackBar);

  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }

  handleEliminaGiocatore(event: { rosaId: number; giocatoreId: number }): void {
    const dialogData: DialogData = {
      title: 'Elimina Calciatore',
      message: 'Sei sicuro di voler procedere con l\'eliminazione? L\'azione è irreversibile.',
      buttons: [
        { label: 'Annulla', value: false },
        { label: 'Elimina', value: true, color: 'warn' }
      ]
    };
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      data: dialogData
    });


    dialogRef.afterClosed()
      .pipe(
        mergeMap((result=>{
          if(result){
            return this.legaService.eliminaGiocatore(event.rosaId.toString(),event.giocatoreId.toString());
          }else {
              return EMPTY;
          }
        })),
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

  handleAggiungiGiocatore(newCalciatore: Calciatore): void {
    const{nome, cognome, prezzoPagato, ruolo, squadraId = 0} = newCalciatore || {};
    const astaAssegnazione: AssegnazioneAstaDTO = {
      nome,cognome,prezzoPagato,ruolo,squadraId
    }
    this.legaService.aggiungiGiocatore(astaAssegnazione)
    .pipe(
      mergeMap(()=> this.legaService.getRose(this.legaService.getLegaResponseDTO()?.id || 0)),
      catchError((err: HttpErrorResponse) => {
                const messaggio = extractErrorMessage(err); 
                this.snackBar.open(messaggio, 'Chiudi', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                });
                return throwError(() => err);
              }),
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