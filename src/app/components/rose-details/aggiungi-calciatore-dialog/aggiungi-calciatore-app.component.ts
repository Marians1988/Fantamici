import { Component,inject, OnDestroy} from '@angular/core';
;
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { Calciatore, Ruolo } from '../../../models/models';


@Component({
  selector: 'app-aggiungi-calciatore-component',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatError, MatLabel, MatFormField, MatInputModule,
    MatSelect,MatOption,
    MatButtonModule
  ],
  templateUrl: './aggiungi-calciatore-app.component.html',
  styleUrl: './aggiungi-calciatore-app.component.scss',
})
export class AggiungiCalciatoreAppComponent implements OnDestroy {

    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<AggiungiCalciatoreAppComponent>);
    private readonly destroy$ = new Subject<void>();

    roles: Ruolo[] = [
        { value: 'Portiere', type: 'P' },
        { value: 'Difensore', type: 'D' },
        { value: 'Centrocampista', type: 'C' },
        { value: 'Attaccante', type: 'A' }
    ];

    playerForm: FormGroup = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      prezzoPagato: [null, [Validators.required, Validators.min(0.1)]],
      ruolo: ['', Validators.required]
    });

    onCancel(): void {
      this.dialogRef.close();
    }

    onSubmit(): void {
      if (this.playerForm.valid) {
        // Chiude la modal e restituisce i dati al chiamante
        this.dialogRef.close(this.playerForm.value as Calciatore);
      } else {
        this.playerForm.markAllAsTouched();
      }
    }

    ngOnDestroy(): void {
      this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
      this.destroy$.complete(); // Chiude definitivamente il Subject
    }
}