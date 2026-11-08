import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CycleService } from '../../cycle-management/cycle.service';
import { CycleStatus } from '../../cycle-management/cycle.model';

/**
 * Route guard that validates whether an active purchasing cycle is open (RN-01 / RN-02.8).
 * Checks GET /api/v1/cycles/active:
 * - 200 OK (OPEN): Allows navigation to the Totem.
 * - 204 No Content / CLOSED: Redirects to /ciclo-fechado (CycleClosedPage).
 */
export const activeCycleGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const cycleService = inject(CycleService);
  const router = inject(Router);

  return cycleService.consultActiveCycle().pipe(
    map((cycle) => {
      if (cycle && cycle.status === CycleStatus.OPEN) {
        return true;
      }
      return router.createUrlTree(['/ciclo-fechado']);
    }),
  );
};
