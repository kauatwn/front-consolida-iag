import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { resolveUserHomeCommands } from './auth-redirect';
import { Auth } from './auth';
import { Token } from './token';

export const rootRedirectGuard: CanActivateFn = (): Observable<UrlTree> => {
  const auth = inject(Auth);
  const token = inject(Token);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return of(router.createUrlTree(resolveUserHomeCommands(auth.currentUser())));
  }

  return toObservable(token.isInitialized).pipe(
    filter(Boolean),
    take(1),
    switchMap(() => {
      if (!token.isAuthenticated()) {
        return of(router.createUrlTree(['/login']));
      }

      return auth.getUserProfile().pipe(
        map((session) => router.createUrlTree(resolveUserHomeCommands(session))),
        catchError(() => of(router.createUrlTree(['/login']))),
      );
    }),
  );
};
