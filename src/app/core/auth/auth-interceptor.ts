import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Token } from './token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = inject(Token);

  return from(token.getAccessToken()).pipe(
    switchMap((accessToken) => {
      const authorizedRequest = accessToken
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req;

      return next(authorizedRequest).pipe(
        catchError((error: unknown) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === HttpStatusCode.Unauthorized &&
            token.isAuthenticated()
          ) {
            return from(token.getAccessToken(true)).pipe(
              switchMap((refreshedToken) => {
                if (!refreshedToken) return throwError(() => error);
                return next(
                  req.clone({
                    setHeaders: { Authorization: `Bearer ${refreshedToken}` },
                  }),
                );
              }),
            );
          }

          return throwError(() => error);
        }),
      );
    }),
  );
};
