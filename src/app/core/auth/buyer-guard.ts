import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { resolveUserHomeCommands } from './auth-redirect';
import { Auth } from './auth';

export const buyerGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentUser = auth.currentUser();

  if (currentUser?.role === 'BUYER') {
    return true;
  }

  return router.createUrlTree(resolveUserHomeCommands(currentUser));
};
