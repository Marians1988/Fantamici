import { Component, inject, input, OnDestroy, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../shared-service/auth-service';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CreaLegaDialogComponent } from './dialog-crea-lega/crea-lega-dialog.component';
import { filter, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { LegaService } from '../../shared-service/lega.service';

@Component({
  selector: 'app-crea-lega-app-component',
  imports: [MatButton],
  templateUrl: './crea-lega-app.component.html',
  styleUrl: './crea-lega-app.component.scss',
})
export class CreaLegaAppComponent implements OnDestroy {
  back = output();
  dashboard =input(true);
  private readonly destroy$ = new Subject<void>();
  readonly authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private readonly legaService = inject(LegaService);
  private dialogRef: MatDialogRef<CreaLegaDialogComponent> | null = null ;

 
  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }

  openDialog(): void {
     this.dialogRef = this.dialog.open(CreaLegaDialogComponent);
     this.dialogRef?.afterClosed()
     .pipe(
      filter(result => result !== undefined),
      mergeMap(result => {
        return this.legaService.createLega(result as any);
      }),
      tap(lega => {
        console.log('Lega creata:', lega);
        this.legaService.setLegaResponseDTO(lega);
        const{numeroPortieri,numeroDifensori,numeroCentrocampisti,numeroAttaccanti} = lega ;
        const numeroRosa = numeroPortieri+numeroDifensori+numeroCentrocampisti+numeroAttaccanti;
        console.log(numeroRosa,'numeriRosa');
        this.legaService.setNumeroCalciatoriPerRosa(numeroRosa);
      }),
      takeUntil(this.destroy$))
     .subscribe();
  }
}