import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { OpenWeeklyCyclePayload, WeeklyCycle } from './cycle.model';

@Service()
export class Cycle {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cycles`;

  private readonly _currentCycle = signal<WeeklyCycle | null>(null);
  readonly currentCycle = this._currentCycle.asReadonly();

  readonly isCycleOpen = computed(() => this._currentCycle()?.status === 'OPEN');

  /**
   * Fetches the currently active purchasing cycle from GET /api/v1/cycles/active.
   * Returns:
   * - 200 OK: Active WeeklyCycle
   * - 204 No Content: null (Cycle is closed/inactive)
   */
  consultActiveCycle(): Observable<WeeklyCycle | null> {
    return this.http
      .get<WeeklyCycle>(`${this.apiUrl}/active`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<WeeklyCycle>) => {
          if (response.status === HttpStatusCode.NoContent || !response.body) {
            return null;
          }
          return response.body;
        }),
        tap((cycle: WeeklyCycle | null) => {
          this._currentCycle.set(cycle);
        }),
        catchError(() => {
          this._currentCycle.set(null);
          return of(null);
        }),
      );
  }

  /**
   * Opens a new purchasing cycle via POST /api/v1/cycles.
   */
  openCycle(payload: OpenWeeklyCyclePayload): Observable<WeeklyCycle> {
    return this.http.post<WeeklyCycle>(this.apiUrl, payload).pipe(
      tap((newCycle) => {
        this._currentCycle.set(newCycle);
      }),
    );
  }

  /**
   * Closes an existing purchasing cycle via POST /api/v1/cycles/{id}/close.
   */
  closeCycle(cycleId: string): Observable<WeeklyCycle> {
    return this.http.post<WeeklyCycle>(`${this.apiUrl}/${cycleId}/close`, {}).pipe(
      tap((closedCycle) => {
        this._currentCycle.set(closedCycle);
      }),
    );
  }
}
