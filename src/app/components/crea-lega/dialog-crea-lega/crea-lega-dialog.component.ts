import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../shared-service/auth-service';
import { MatError, MatFormField, MatLabel,MatInputModule  } from '@angular/material/input';
import {FormControl,ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { LegaCreateDTO } from '../../../assets/LegaCreateDTO';
import { MatDialogRef } from '@angular/material/dialog';


interface LegaForm {
  nomeLega : FormControl<string>,
  numeroSquadre: FormControl<number>,
  budgetIniziale: FormControl<number>,
  squadraIniziale: FormControl<string>,
  numeroPortieri: FormControl<number>,
  numeroDifensori: FormControl<number>,
  numeroCentrocampisti: FormControl<number>,
  numeroAttaccanti: FormControl<number>,
}

@Component({
  selector: 'app-crea-lega-dialog-component',
  imports: [MatButton, MatError, MatLabel, MatFormField, MatInputModule, ReactiveFormsModule],
  templateUrl: './crea-lega-dialog.component.html',
  styleUrl: './crea-lega-dialog.component.scss',
})
export class CreaLegaDialogComponent {
  readonly authService = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef);


  private readonly formBuilder = inject(FormBuilder);
  profileForm = this.formBuilder.group<LegaForm>({
     nomeLega: new FormControl<string>('',{
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(3)],
      nonNullable: true
    }),
      numeroSquadre: new FormControl<number>(4, {
      validators: [Validators.required, Validators.min(4), Validators.max(16)],
      nonNullable: true
    }),
     squadraIniziale: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(3)],
      nonNullable: true
    }),
     budgetIniziale: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(10000)],
      nonNullable: true
    }),
    numeroPortieri: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(8)],
      nonNullable: true
    }),
    numeroDifensori: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(18)],
      nonNullable: true
    }),
    numeroCentrocampisti: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(18)],
      nonNullable: true
    }),
    numeroAttaccanti: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1), Validators.max(12)],
      nonNullable: true
    }),
  
   });

   
  onSubmit() {
    const legaCreateDTO: LegaCreateDTO = {
      nome: this.profileForm.value.nomeLega || '',
      budgetIniziale: this.profileForm.value.budgetIniziale || 0,
      numeroSquadre: this.profileForm.value.numeroSquadre || 1,
      numeroPortieri: this.profileForm.value.numeroPortieri || 1,
      numeroDifensori: this.profileForm.value.numeroDifensori || 1,
      numeroCentrocampisti: this.profileForm.value.numeroCentrocampisti || 1,
      numeroAttaccanti: this.profileForm.value.numeroAttaccanti || 1,
      squadre: [{
        nomeSquadra: this.profileForm.value.squadraIniziale || '',
        adminKeycloackId: this.authService.getId() || ''
      }]
    };
    this.dialogRef.close(legaCreateDTO);
  }
}