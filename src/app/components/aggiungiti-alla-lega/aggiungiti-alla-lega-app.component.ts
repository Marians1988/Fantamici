import { Component, inject, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../shared-service/auth-service';
import { catchError, filter, mergeMap, Subject, takeUntil, tap, throwError } from 'rxjs';
import { LegaService } from '../../shared-service/lega.service';
import { AggiungiLegaDialogComponent } from './dialog-aggiungi-lega/aggiungi-lega-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorMessage } from '../../shared-service/utility';
@Component({
  selector: 'app-aggiungiti-alla-lega-app-component',
  imports: [MatButton],
  templateUrl: './aggiungiti-alla-lega-app.component.html',
  styleUrl: './aggiungiti-alla-lega-app.component.scss',
})
export class AggiungitiAllaLegaAppComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly authService = inject(AuthService);
  private readonly legaService = inject(LegaService);
  readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<AggiungiLegaDialogComponent> | null = null ;
  private readonly snackBar = inject(MatSnackBar);
 
  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }

   openAggiungitiAllaLegaDialog(): void {
       this.dialogRef =this.dialog.open( AggiungiLegaDialogComponent, {
         width: '400px'
       });
       this.dialogRef?.afterClosed()
       .pipe(
        filter(result => result !== undefined), // Filtra i risultati undefined
        mergeMap(result => {
          return this.legaService.aggiungiSquadra(result)
          .pipe(
              tap(() => {
                  this.snackBar.open('Squadra salvata con successo!', 'Chiudi', {
                    duration: 3000,               
                    horizontalPosition: 'center', 
                    verticalPosition: 'bottom', 
                  });
              }),
              catchError((err: HttpErrorResponse) => {
                const messaggio = extractErrorMessage(err); 
                this.snackBar.open(messaggio, 'Chiudi', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                });
                return throwError(() => err);
              })
          );
        }),
        mergeMap(() => {
          return this.legaService.getLeghe()
          .pipe(
              tap(lega => {
                this.legaService.setLegaResponseDTO(lega);
                console.log('Leghe aggiornate:', lega);
              }),
              catchError((error) => {
                console.error('Errore durante il recupero delle leghe:', error);
                this.snackBar.open(error?.error?.message || 'Errore durante il recupero delle leghe. Riprova più tardi.', 'Chiudi', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                });
                return throwError(() => error);
              })
          );
        }),
        takeUntil(this.destroy$))
       .subscribe();
    }
}