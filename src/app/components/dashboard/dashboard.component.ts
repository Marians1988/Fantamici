
import { Component, computed, inject, OnDestroy, OnInit, signal, } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderAppComponent } from '../header-app/header-app.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../../shared-service/auth-service';
import { CreaLegaAppComponent } from '../crea-lega/crea-lega-app.component';
import { LegaService } from '../../shared-service/lega.service';
import { Subject, takeUntil } from 'rxjs';
import { LegaDetailsAppComponent } from '../lega-details/lega-details-app.component';
import { AggiungitiAllaLegaAppComponent } from '../aggiungiti-alla-lega/aggiungiti-alla-lega-app.component';
import { RoseDetailsAppComponent } from '../rose-details/rose-details-app.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderAppComponent, MatTabGroup, MatTab, CreaLegaAppComponent,LegaDetailsAppComponent,RoseDetailsAppComponent,AggiungitiAllaLegaAppComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly legaService = inject(LegaService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  readonly authService = inject(AuthService);
  public emptyLega = computed(() => {
    console.log('Computed emptyLega called, current legaResponseDTO:', this.legaService.getLegaResponseDTO() === undefined);
    return this.legaService.getLegaResponseDTO() === undefined || this.legaService.getLegaResponseDTO() === null;
  });

  get selectedTabIndex() {
    return this.router.url.includes('/dashboard/routing/departures') ? 1 : 0;
  }

  ngOnInit(): void {
    this.authService.handleLoginSuccess();
    if(this.legaService.getLegaResponseDTO() === undefined){ 
      this.getLeghe(); // Recupera le leghe quando il componente viene inizializzato
    }
  }
    
  ngOnDestroy(): void {
    this.destroy$.next();    // Invia il segnale di stop a tutte le pipe in ascolto
    this.destroy$.complete(); // Chiude definitivamente il Subject
  }


  onTabChange(index:number) {
    if(index === 0) {
      if(this.legaService.getLegaResponseDTO() === undefined) 
      this.getLeghe(); 
    }else if(index === 1) {
      const legaId = this.legaService.getLegaResponseDTO()?.id;
      if(legaId !== undefined) {
        this.getRose(legaId);
      }
    }
  }

  private getLeghe() {
    this.legaService.getLeghe()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lega) => {
          console.log('Leghe retrieved:', lega);
          this.legaService.setLegaResponseDTO(lega);
          const{numeroPortieri,numeroDifensori,numeroCentrocampisti,numeroAttaccanti} = lega ;
          const numeroRosa = numeroPortieri+numeroDifensori+numeroCentrocampisti+numeroAttaccanti;
          this.legaService.setNumeroCalciatoriPerRosa(numeroRosa);
        },
        error: (err) => {
          console.error('Errore durante il recupero delle leghe:', err);
        }
      });
  }

  private getRose(legaId: number) {
    this.legaService.getRose(legaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roseData) => {
          const { rose = [] } = roseData;
          this.legaService.setRosaSquadraDTO(rose);
        },
        error: (err) => {
          console.error('Errore durante il recupero delle rose:', err);
        }
      });
  }

  navigateTo(route:string){
    if(route === '') {
      this.router.navigate(['/dashboard/menu']);
    } else {
      this.router.navigate(['/dashboard', route]);
    }
  }
  
}

