import { inject, Injectable, Injector, signal } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Libreria standard per decodificare i JWT
import Keycloak from 'keycloak-js';
import { SseNotificheService } from './sse-notifiche.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private readonly injector = inject(Injector);
  // Un BehaviorSubject permette a tutti i componenti di "ascoltare" il ruolo in tempo reale
  private readonly userRole$ = new BehaviorSubject<string | null>(sessionStorage.getItem('user_role'));
  private readonly keycloak = inject(Keycloak);
  private readonly username = signal<string>('');
  private readonly id = signal<string>('');
  private readonly name = signal<string>('');
  private readonly surname = signal<string>('');
  private readonly token = signal<string>('');
  constructor() {}


  public handleLoginSuccess(): void {
    if (this.keycloak.authenticated) {
      this.keycloak.loadUserProfile()
        .then(profile => {
          this.token.set(this.keycloak.token || '');
          this.username.set(profile.username || 'Utente');
          this.name.set(profile.firstName || '');
          this.surname.set(profile.lastName || '');
          this.id.set(profile.id || '');
          const decodedToken: any = jwtDecode(this.keycloak.token || '');
          const role = decodedToken.roles ? decodedToken.roles : 'ROLE_USER';
          sessionStorage.setItem('user_role', role);
          this.userRole$.next(role);
        })
        .catch(err => {
          console.error('Errore durante il caricamento del profilo utente:', err);
        });
    }
  }

  public getRole(): string | null {
    return this.userRole$.value;
  }

  public isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  public getUsername(): string | null {
    return this.username();
  }
  public getName(): string | null {
    return this.name();
  }   
  public getSurname(): string | null {
    return this.surname();
  } 
  public getToken(): string | null {
    return this.token();
  }
  public getId(): string | null {
    return this.id();
  }
  // Svuota tutto al logout
  public logout(): void {
    if(!this.isAdmin()){
      const sseService = this.injector.get(SseNotificheService);
      sseService.chiudiConnessione();
    }
    this.keycloak.logout({ redirectUri: globalThis.location.origin });
    sessionStorage.removeItem('user_role');
    this.userRole$.next(null);
    this.token.set('');
  }
}