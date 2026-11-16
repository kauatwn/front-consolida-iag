import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EditWeeklyRequestPayload,
  ServiceCode,
  SubmitWeeklyRequestPayload,
  SubmitWeeklyRequestResponse,
  WeeklyRequestDetailsResponse,
} from './weekly-request.model';

export class RequestConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestConflictError';
  }
}

export class CycleClosedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CycleClosedError';
  }
}

@Service()
export class WeeklyRequest {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/requests`;

  /**
   * Consulta a solicitação ativa do serviço no ciclo aberto atual.
   * Retorna `null` quando a API responde 204 No Content (nenhum pedido enviado ainda).
   */
  consultActiveRequest(serviceCode: ServiceCode): Observable<WeeklyRequestDetailsResponse | null> {
    return this.http
      .get<WeeklyRequestDetailsResponse | null>(`${this.apiUrl}/active/${serviceCode}`)
      .pipe(map((response) => response ?? null));
  }

  /**
   * Submete uma nova solicitação semanal (POST /api/v1/requests).
   */
  submitRequest(payload: SubmitWeeklyRequestPayload): Observable<SubmitWeeklyRequestResponse> {
    return this.http
      .post<SubmitWeeklyRequestResponse>(this.apiUrl, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.mapMutationError(error, payload.serviceCode)),
      );
  }

  /**
   * Atualiza uma solicitação existente enquanto o ciclo estiver aberto (PUT /api/v1/requests/{id}).
   */
  editRequest(
    requestId: string,
    payload: EditWeeklyRequestPayload,
  ): Observable<SubmitWeeklyRequestResponse> {
    return this.http
      .put<SubmitWeeklyRequestResponse>(`${this.apiUrl}/${requestId}`, payload)
      .pipe(catchError((error: HttpErrorResponse) => this.mapMutationError(error)));
  }

  private mapMutationError(error: HttpErrorResponse, serviceCode?: ServiceCode): Observable<never> {
    if (error.status === HttpStatusCode.Conflict) {
      const unitLabel = serviceCode ? `O serviço ${serviceCode}` : 'Este serviço';
      return throwError(
        () =>
          new RequestConflictError(
            `${unitLabel} já enviou uma solicitação para o ciclo atual (RN-02.4).`,
          ),
      );
    }

    if (error.status === HttpStatusCode.UnprocessableEntity) {
      return throwError(
        () =>
          new CycleClosedError(
            'O ciclo semanal já foi encerrado pela gestão e não aceita mais alterações (RN-02.5).',
          ),
      );
    }

    return throwError(() => error);
  }
}
