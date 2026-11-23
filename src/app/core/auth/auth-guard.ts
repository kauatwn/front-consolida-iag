import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { Auth } from './auth';
import { Token } from './token';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const auth = inject(Auth);
  const token = inject(Token);
  const router = inject(Router);

  const loginTree = router.createUrlTree(['/login']);

  if (auth.isAuthenticated()) {
    return of(true);
  }

  return toObservable(token.isInitialized).pipe(
    filter(Boolean),
    take(1),
    switchMap(() => {
      if (!token.isAuthenticated()) {
        return of(loginTree);
      }

      return auth.getUserProfile().pipe(
        map(() => true),
        catchError(() => of(loginTree)),
      );
    }),
  );
};
