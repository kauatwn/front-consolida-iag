import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CatalogProduct,
  CATEGORY_LABELS,
  CategoryGroup,
  UNIT_MEASURE_LABELS,
} from './product.model';

@Service()
export class Catalog {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  private readonly _products = signal<CatalogProduct[]>([]);
  readonly products = this._products.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly groupedProducts = computed<CategoryGroup[]>(() => {
    const activeProducts = this._products().filter((p) => p.active !== false);
    const groupsMap = new Map<string, CategoryGroup>();

    for (const prod of activeProducts) {
      const catKey = prod.category || 'OUTROS';
      const catName = prod.categoryDisplayName || CATEGORY_LABELS[catKey] || 'Outros';

      if (!groupsMap.has(catKey)) {
        groupsMap.set(catKey, {
          category: catKey,
          categoryDisplayName: catName,
          products: [],
        });
      }

      groupsMap.get(catKey)!.products.push(prod);
    }

    return Array.from(groupsMap.values());
  });

  listCatalogProducts(): Observable<CatalogProduct[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<CatalogProduct[]>(this.apiUrl).pipe(
      map((items) =>
        (items ?? []).map((item) => ({
          ...item,
          categoryDisplayName: item.categoryDisplayName ?? CATEGORY_LABELS[item.category],
        })),
      ),
      tap((items) => {
        this._products.set(items);
        this._loading.set(false);
      }),
      catchError((err) => {
        const message =
          err.error?.detail ||
          err.error?.message ||
          'Não foi possível carregar o catálogo de alimentos.';
        this._error.set(message);
        this._products.set([]);
        this._loading.set(false);
        return of([]);
      }),
    );
  }

  formatUnitMeasure(unit: string): string {
    return UNIT_MEASURE_LABELS[unit] ?? unit;
  }
}
