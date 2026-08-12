import { Component,inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { MatCardModule,} from '@angular/material/card';
import { Subject} from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LegaService } from '../../../shared-service/lega.service';
import { AuthService } from '../../../shared-service/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { AggiungiCalciatoreAppComponent } from '../aggiungi-calciatore-dialog/aggiungi-calciatore-app.component';
import { RosaSquadraDTO } from '../../../assets/RosaSquadraDTO';
import { Calciatore } from '../../../models/models';


export interface Giocatore {
  id: number;
  ruolo: 'P' | 'D' | 'C' | 'A';
  nome: string;
  cognome: string;
  prezzo: number;
}

export interface Rosa {
  id: number;
  nomeSquadra: string;
  giocatori: Giocatore[];
}

@Component({
  selector: 'app-formazione-component',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule
  ],
  templateUrl: './formazione-app.component.html',
  styleUrl: './formazione-app.component.scss',
})
export class FormazioneAppComponent implements OnInit, OnDestroy {
    rosa = input.required<RosaSquadraDTO>();
    aggiungiGiocatore = output<Calciatore>();
    eliminaGiocatore = output<{ rosaId: number; giocatoreId: number }>();
    readonly legaService = inject(LegaService);
    readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);
    private readonly destroy$ = new Subject<void>();
    displayedColumns: string[] = [];

    ruoloClasses: Record<'P' | 'D' | 'C' | 'A', string> = {
      P: 'bg-red-600 text-white',
      D: 'bg-yellow-400 text-black',
      C: 'bg-green-600 text-white',
      A: 'bg-cyan-500 text-white'
    };

    ngOnInit(): void {
      this.displayedColumns = this.authService.isAdmin() ? ['ruolo', 'calciatore', 'prezzo', 'azioni'] : ['ruolo', 'calciatore', 'prezzo'];
    }

    ngOnDestroy(): void {
      this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
      this.destroy$.complete(); // Chiude definitivamente il Subject
    }

    getRuoloClass(ruolo: string): string {
    return this.ruoloClasses[ruolo as keyof typeof this.ruoloClasses] ?? 'bg-gray-400 text-white';
  }

    onElimina(giocatoreId: number): void {
      this.eliminaGiocatore.emit({ rosaId: this.rosa().squadraId, giocatoreId });
    }

    openAggiungiCalciatoreDialog(): void {
    const dialogRef = this.dialog.open(AggiungiCalciatoreAppComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: Calciatore | undefined) => {
      if (result) {
        const newCalciatore: Calciatore = {...result, squadraId:this.rosa().squadraId}
        this.aggiungiGiocatore.emit(newCalciatore)
      }
    });
  }
}