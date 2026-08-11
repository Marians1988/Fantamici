import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] // <--- Usa la Functional Guard qui
  },
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  }
];
