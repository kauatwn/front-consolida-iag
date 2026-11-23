import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { UserSession } from './user-session';

export function resolveUserHomeCommands(user: UserSession | null): string[] {
  if (user?.role === 'BUYER') {
    return ['/consolidacao'];
  }

  if (user?.role === 'KITCHEN_LEADER' && user.serviceCode) {
    return ['/pedido', user.serviceCode.toLowerCase()];
  }

  return ['/login'];
}

export const homeRedirectGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return router.createUrlTree(resolveUserHomeCommands(auth.currentUser()));
};
