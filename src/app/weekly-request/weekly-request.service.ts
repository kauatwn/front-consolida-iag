import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import {
  ServiceCode,
  SubmitWeeklyRequestPayload,
  SubmitWeeklyRequestResponse,
} from './weekly-request.model';

export class RequestConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestConflictError';
  }
}

@Service()
export class WeeklyRequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/requests';

  /**
   * Submits a weekly request for the active purchasing cycle.
   * - Enforces RN-02.2: filter quantity > 0 (done in totem-cart.state before calling).
   * - Enforces RN-02.4: throws RequestConflictError if status 409 Conflict.
   */
  submitRequest(payload: SubmitWeeklyRequestPayload): Observable<SubmitWeeklyRequestResponse> {
    return this.http.post<SubmitWeeklyRequestResponse>(this.apiUrl, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError(
            () =>
              new RequestConflictError(
                `O serviço ${payload.serviceCode} já enviou uma solicitação para o ciclo atual (RN-02.4).`,
              ),
          );
        }

        // Development fallback if backend is not running
        if (error.status === 0 || error.status === HttpStatusCode.NotFound) {
          console.warn(
            '[WeeklyRequestService] Backend offline, returning simulated submission response.',
          );
          const simulatedResponse: SubmitWeeklyRequestResponse = {
            id: 'mock-' + Math.random().toString(36).substring(2, 9),
            serviceCode: payload.serviceCode,
            cycleId: '7b9e4a81-2c3d-4e5f-a6b7-8c9d0e1f2a3b',
            submissionDate: new Date().toISOString(),
            itemsCount: payload.items.length,
          };
          return of(simulatedResponse);
        }

        return throwError(() => error);
      }),
    );
  }

  /**
   * Checks if an active request already exists for the given service in the current cycle.
   */
  consultActiveRequest(serviceCode: ServiceCode): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/active/${serviceCode}`);
  }
}
