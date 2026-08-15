import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificaEvent } from '../models/models';

@Component({
  selector: 'app-notifica-acquisto-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">🚨 {{ data.type === 'ACQUISTO'? "NUOVO ACQUISTO COMPLETATO!": "GIOCATORE ELIMINATO!" }}</h2>
    
    <mat-dialog-content class="dialog-content">
      <div class="calciatore-card">
        <h3>{{ data.payload.nomeCalciatore }}</h3>
        <span class="badge" [ngClass]="data.payload.ruolo.toLowerCase()">{{ data.payload.ruolo }}</span>
      </div>

      <div class="dettagli">
        <p><strong>Squadra Acquirente:</strong> {{ data.payload.nomeSquadraAcquirente }}</p>
        <p><strong>Prezzo Pagato:</strong> <span class="prezzo">{{ data.payload.prezzoPagato }} crediti</span></p>
        <p><strong>Budget Rimanente Squadra:</strong> {{ data.payload.budgetSquadraRimanente }} crediti</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="chiudi()">Chiudi</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { color: #2c3e50; font-weight: bold; text-align: center; }
    .calciatore-card { text-align: center; margin-bottom: 15px; }
    .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; color: white; }
    .badge.p, .badge.portiere { background-color: #f39c12; }
    .badge.d, .badge.difensore { background-color: #27ae60; }
    .badge.c, .badge.centrocampista { background-color: #2980b9; }
    .badge.a, .badge.attaccante { background-color: #c0392b; }
    .prezzo { color: #27ae60; font-weight: bold; font-size: 1.1em; }
    .dettagli p { margin: 8px 0; font-size: 1em; }
  `]
})
export class NotificaAcquistoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificaAcquistoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificaEvent
  ) {}

  chiudi(): void {
    this.dialogRef.close();
  }
}