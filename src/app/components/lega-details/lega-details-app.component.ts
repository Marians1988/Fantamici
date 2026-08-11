import { Component, inject, input, OnDestroy,OnInit,output, signal} from '@angular/core';
import {MatCard, MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import { AuthService } from '../../shared-service/auth-service';
import { Subject} from 'rxjs';
import { LegaService } from '../../shared-service/lega.service';
import { MatButton } from '@angular/material/button';
import { DialogData, GenericDialogComponent } from '../dialogs/generic-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-lega-details-app-component',
  imports: [MatCard,MatCardHeader,MatCardTitle,MatCardSubtitle,MatCardModule,MatButton,MatIcon,MatChipsModule],
  templateUrl: './lega-details-app.component.html',
  styleUrl: './lega-details-app.component.scss',
})
export class LegaDetailsAppComponent implements OnDestroy {
  back = output();
  dashboard =input(true);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();
  readonly authService = inject(AuthService);
  readonly legaService = inject(LegaService);
   

  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }

  openEliminaLegaDialog(): void {
      const dialogData: DialogData = {
        title: 'Elimina Lega',
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

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.legaService.eliminaLega().subscribe({
            next: () => {
              console.log('Lega eliminata con successo.');
              this.legaService.setLegaResponseDTO(undefined);
            },
            error: (err) => {
              console.error('Errore durante l\'eliminazione della lega:', err);
            }
          });
        } else {
          console.log('Operazione annullata dall\'utente.');
        }
      });
  }
}