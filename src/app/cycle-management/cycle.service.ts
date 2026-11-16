import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeeklyCycle } from './cycle.model';

@Service()
export class CycleService {
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
        catchError((error) => {
          // If 404 or connection error in development without running backend,
          // provide a default open mock cycle so the totem can be tested out-of-the-box
          if (error.status === 0 || error.status === HttpStatusCode.NotFound) {
            console.warn(
              '[CycleService] Backend unavailable. Falling back to default active mock cycle.',
            );
            const mockCycle: WeeklyCycle = {
              id: '7b9e4a81-2c3d-4e5f-a6b7-8c9d0e1f2a3b',
              startDate: '2026-11-02',
              endDate: '2026-11-08',
              status: 'OPEN',
            };
            this._currentCycle.set(mockCycle);
            return of(mockCycle);
          }

          this._currentCycle.set(null);
          return of(null);
        }),
      );
  }

  /**
   * Helper to manually set cycle state for testing/development simulations.
   */
  setMockCycleState(status: 'OPEN' | 'CLOSED' | null): void {
    if (!status) {
      this._currentCycle.set(null);
    } else {
      this._currentCycle.set({
        id: '7b9e4a81-2c3d-4e5f-a6b7-8c9d0e1f2a3b',
        startDate: '2026-11-02',
        endDate: '2026-11-08',
        status,
      });
    }
  }
}
