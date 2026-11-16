import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatalogProduct, CategoryGroup, ProductCategory, UnitMeasure } from './product.model';

@Service()
export class Catalog {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  private readonly _products = signal<CatalogProduct[]>([]);
  readonly products = this._products.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly groupedProducts = computed<CategoryGroup[]>(() => {
    const activeProducts = this._products().filter((p) => p.active !== false);
    const groupsMap = new Map<string, CategoryGroup>();

    for (const prod of activeProducts) {
      const catKey = prod.category || ProductCategory.OUTROS;
      const catName = prod.categoryDisplayName || 'Itens Gerais';

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
      map((items) => this.normalizeProducts(items)),
      tap((items) => {
        this._products.set(items);
        this._loading.set(false);
      }),
      catchError((err) => {
        console.warn(
          '[CatalogService] Backend unavailable, loading default institutional catalog items.',
          err,
        );
        const fallback = this.getDefaultMockCatalog();
        this._products.set(fallback);
        this._loading.set(false);
        return of(fallback);
      }),
    );
  }

  private normalizeProducts(items: CatalogProduct[]): CatalogProduct[] {
    if (!items || items.length === 0) {
      return this.getDefaultMockCatalog();
    }

    return items.map((item) => {
      const category = item.category || ProductCategory.OUTROS;
      return {
        ...item,
        category,
        unitMeasure: this.normalizeUnit(item.unitMeasure),
        categoryDisplayName: item.categoryDisplayName ?? this.formatCategoryName(category),
      };
    });
  }

  private normalizeUnit(unit?: string): string {
    const u = (unit || '').toUpperCase().trim();
    if (u === 'KG' || u === 'QUILO') return UnitMeasure.KG;
    if (u === 'L' || u === 'LITRO' || u === 'LITROS' || u === 'ML') return UnitMeasure.LITRO;
    if (u.includes('PCT') || u.includes('PACOTE')) return UnitMeasure.PACOTE;
    if (u === 'CX' || u === 'CAIXA' || u === 'CAIXAS') return 'Caixa';
    if (u === 'G' || u === 'GRAMAS' || u === 'GRAMA') return UnitMeasure.GRAMAS;
    if (u === 'UN' || u === 'UNIDADE' || u === 'UNIDADES') return UnitMeasure.UNIDADE;
    return unit || UnitMeasure.UNIDADE;
  }

  private formatCategoryName(category?: string): string {
    switch (category) {
      case ProductCategory.GRAOS_E_CEREAIS:
        return 'Grãos e Cereais';
      case ProductCategory.HORTIFRUTI_FRESCOS:
        return 'Hortifrúti e Frescos';
      case ProductCategory.PROTEINAS_CARNES:
        return 'Proteínas e Carnes';
      case ProductCategory.LATICINIOS_MATINAIS:
        return 'Laticínios e Matinais';
      case ProductCategory.HIGIENE_COZINHA:
        return 'Higiene & Limpeza da Cozinha';
      default:
        return 'Itens Gerais';
    }
  }

  private getDefaultMockCatalog(): CatalogProduct[] {
    return [
      {
        id: 'e4a8b1c2-3d4e-5f6a-7b8c-9d0e1f2a3b4c',
        name: 'Arroz Agulhinha Tipo 1',
        unitMeasure: UnitMeasure.KG,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Fardo 5kg',
        active: true,
      },
      {
        id: 'feijao-carioca-uuid',
        name: 'Feijão Carioca',
        unitMeasure: UnitMeasure.KG,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Pacote 1kg',
        active: true,
      },
      {
        id: 'macarrao-espaguete-uuid',
        name: 'Macarrão Espaguete',
        unitMeasure: UnitMeasure.PACOTE,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Pacote 500g',
        active: true,
      },
      {
        id: 'oleo-soja-uuid',
        name: 'Óleo de Soja',
        unitMeasure: UnitMeasure.LITRO,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Garrafa 900ml',
        active: true,
      },
      {
        id: 'acucar-cristal-uuid',
        name: 'Açúcar Cristal',
        unitMeasure: UnitMeasure.KG,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Pacote 1kg',
        active: true,
      },
      {
        id: 'sal-refinado-uuid',
        name: 'Sal Refinado',
        unitMeasure: UnitMeasure.KG,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Pacote 1kg',
        active: true,
      },
      {
        id: 'farinha-trigo-uuid',
        name: 'Farinha de Trigo',
        unitMeasure: UnitMeasure.KG,
        category: ProductCategory.GRAOS_E_CEREAIS,
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Pacote 1kg',
        active: true,
      },
      {
        id: 'leite-integral-uuid',
        name: 'Leite Integral UHT',
        unitMeasure: UnitMeasure.LITRO,
        category: ProductCategory.LATICINIOS_MATINAIS,
        categoryDisplayName: 'Laticínios e Matinais',
        description: 'Caixa 1L',
        active: true,
      },
      {
        id: 'f5b9c3d4-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
        name: 'Detergente Neutro',
        unitMeasure: UnitMeasure.UNIDADE,
        category: ProductCategory.HIGIENE_COZINHA,
        categoryDisplayName: 'Higiene & Limpeza da Cozinha',
        description: 'Frasco 500ml',
        active: true,
      },
      {
        id: 'agua-sanitaria-uuid',
        name: 'Água Sanitária',
        unitMeasure: UnitMeasure.LITRO,
        category: ProductCategory.HIGIENE_COZINHA,
        categoryDisplayName: 'Higiene & Limpeza da Cozinha',
        description: 'Frasco 1L',
        active: true,
      },
      {
        id: 'esponja-multiuso-uuid',
        name: 'Esponja Multiuso',
        unitMeasure: UnitMeasure.PACOTE,
        category: ProductCategory.HIGIENE_COZINHA,
        categoryDisplayName: 'Higiene & Limpeza da Cozinha',
        description: 'Pacote c/ 3 un',
        active: true,
      },
    ];
  }
}
