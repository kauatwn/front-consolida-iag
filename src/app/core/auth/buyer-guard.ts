import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth } from './auth';

export const buyerGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentUser = auth.currentUser();

  if (currentUser?.role === 'BUYER') {
    return true;
  }

  if (currentUser?.role === 'KITCHEN_LEADER' && currentUser.serviceCode) {
    return router.createUrlTree(['/pedido', currentUser.serviceCode.toLowerCase()]);
  }

  return router.createUrlTree(['/login']);
};
