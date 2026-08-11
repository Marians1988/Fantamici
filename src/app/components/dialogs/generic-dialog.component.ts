import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogButton {
  label: string;
  value: any;
  color?: 'primary' | 'accent' | 'warn';
}

export interface DialogData {
  title?: string;
  message: string;
  buttons: [DialogButton, DialogButton]; // Forza esattamente due bottoni
}

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    @if (data.title) {
      <h2 mat-dialog-title>{{ data.title }}</h2>
    }

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button 
        mat-button 
        [color]="data.buttons[0].color || undefined"
        (click)="close(data.buttons[0].value)">
        {{ data.buttons[0].label }}
      </button>

      <button 
        mat-raised-button 
        [color]="data.buttons[1].color || 'primary'"
        (click)="close(data.buttons[1].value)">
        {{ data.buttons[1].label }}
      </button>
    </mat-dialog-actions>
  `
})
export class GenericDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GenericDialogComponent>);
  readonly data: DialogData = inject(MAT_DIALOG_DATA);

  close(result: any): void {
    this.dialogRef.close(result);
  }
}