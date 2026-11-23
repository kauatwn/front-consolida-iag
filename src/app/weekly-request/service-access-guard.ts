import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth } from '../core/auth/auth';

export const serviceAccessGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentUser = auth.currentUser();
  if (!currentUser || currentUser.role === 'BUYER') {
    return true;
  }

  const requestedService = route.paramMap.get('serviceCode')?.toUpperCase();
  const assignedService = currentUser.serviceCode?.toUpperCase();

  if (assignedService && requestedService && requestedService !== assignedService) {
    return router.createUrlTree(['/pedido', assignedService.toLowerCase()]);
  }

  return true;
};
