import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { Cycle } from './cycle';
import { CycleStatus } from './cycle.model';

export const activeCycleGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const cycle = inject(Cycle);
  const router = inject(Router);
  const closedCycleTree = router.createUrlTree(['/ciclo-fechado']);

  return cycle.consultActiveCycle().pipe(
    map((activeCycle) =>
      activeCycle && activeCycle.status === CycleStatus.OPEN ? true : closedCycleTree,
    ),
    catchError(() => of(closedCycleTree)),
  );
};
