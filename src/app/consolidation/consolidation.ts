import { HttpClient, HttpParams, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsolidatedReport } from './consolidation.model';

@Service()
export class Consolidation {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/consolidation`;

  getConsolidatedReport(cycleId: string, search?: string): Observable<ConsolidatedReport> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ConsolidatedReport>(`${this.apiUrl}/cycles/${cycleId}`, { params });
  }

  getActiveConsolidatedReport(search?: string): Observable<ConsolidatedReport | null> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http
      .get<ConsolidatedReport>(`${this.apiUrl}/active`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<ConsolidatedReport>) => {
          if (response.status === HttpStatusCode.NoContent || !response.body) {
            return null;
          }
          return response.body;
        }),
        catchError(() => of(null)),
      );
  }
}
