import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloak = inject(Keycloak);

  if (keycloak.authenticated) {
    return true;
  }

  await keycloak.login({
    redirectUri: window.location.origin + state.url
  });
  
  return false;
};