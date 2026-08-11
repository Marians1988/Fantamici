import { Component, inject, OnDestroy,OnInit, signal, Signal, WritableSignal } from '@angular/core';
import {MatCard, MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import { AuthService } from '../../shared-service/auth-service';
import { Subject} from 'rxjs';
import { LegaService } from '../../shared-service/lega.service';
import { MatButton } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { LegaRoseResponseDTO } from '../../assets/LegaRoseResponseDTO';

@Component({
  selector: 'app-rose-details-app-component',
  imports: [MatCard,MatCardHeader,MatCardTitle,MatCardSubtitle,MatCardModule,MatButton,MatIcon,MatChipsModule],
  templateUrl: './rose-details-app.component.html',
  styleUrl: './rose-details-app.component.scss',
})
export class RoseDetailsAppComponent implements OnDestroy {
  readonly legaService = inject(LegaService);
  readonly legaId = this.legaService.getLegaResponseDTO()?.id.toString() || '';
  private readonly destroy$ = new Subject<void>();
  readonly authService = inject(AuthService);

 
  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }
}