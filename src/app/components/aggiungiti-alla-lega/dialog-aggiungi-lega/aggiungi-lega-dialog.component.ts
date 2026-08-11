import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../shared-service/auth-service';
import { MatError, MatFormField, MatLabel,MatInputModule  } from '@angular/material/input';
import {FormControl,ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AggiungiSquadraDTO } from '../../../assets/AggiungiSquadraDTO';


interface AggiungiLegaForm {
  nomeSquadra : FormControl<string>,
  gettoneAccesso : FormControl<string>
}

@Component({
  selector: 'app-aggiungi-lega-dialog-component',
  imports: [MatButton, MatError, MatLabel, MatFormField, MatInputModule, ReactiveFormsModule],
  templateUrl: './aggiungi-lega-dialog.component.html',
  styleUrl: './aggiungi-lega-dialog.component.scss',
})
export class AggiungiLegaDialogComponent {
  readonly authService = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef);


  private readonly formBuilder = inject(FormBuilder);
  profileForm = this.formBuilder.group<AggiungiLegaForm>({
     nomeSquadra: new FormControl<string>('',{
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(3)],
      nonNullable: true
    }),
      gettoneAccesso: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(16),Validators.pattern('^[0-9]+$')],
      nonNullable: true
    }),
   });

   
  onSubmit() {
    const aggiungiSquadraDTO: AggiungiSquadraDTO = {
      nomeSquadra: this.profileForm.value.nomeSquadra || '',
      idLega: Number(this.profileForm.value.gettoneAccesso ||'0')
    };
    this.dialogRef.close(aggiungiSquadraDTO);
  }
}