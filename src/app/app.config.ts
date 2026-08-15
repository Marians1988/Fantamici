import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { 
  provideKeycloak, 
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, // <--- Importiamo il token di configurazione corretto
  createInterceptorCondition
} from 'keycloak-angular';
import { nullToUndefinedInterceptor } from './interceptors/null-to-undefined.interceptor';
import { authErrorInterceptor } from './interceptors/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    
    // 1. Registriamo l'interceptor funzionale per intercettare le richieste HTTP
    provideHttpClient(
      withInterceptors([authErrorInterceptor,includeBearerTokenInterceptor,nullToUndefinedInterceptor])
    ),
    
    // 2. Configura l'interceptor dicendogli quali URL (Spring Boot) devono ricevere il JWT
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [
        createInterceptorCondition({
          urlPattern: /^http:\/\/localhost:8080\/.*$/, // Espressione regolare per il backend Spring Boot
          bearerPrefix: 'Bearer' // Opzionale, è il valore di default
        })
      ]
    },
    // 3. Inizializzazione pulita di Keycloak (features può rimanere vuoto se non usi il refresh automatico avanzato)
    provideKeycloak({
      config: {
        url: 'http://localhost:8090', 
        realm: 'fantacalcio-realm',            
        clientId: 'fantacalcio-app'       
      },
      initOptions: {
        onLoad: 'check-sso',          
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      },
      features: [] 
    })
  ]
};