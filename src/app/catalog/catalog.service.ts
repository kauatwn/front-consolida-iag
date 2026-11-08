import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CatalogProduct, CategoryGroup } from './product.model';

@Service()
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/products';

  private readonly _products = signal<CatalogProduct[]>([]);
  readonly products = this._products.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  /**
   * Category icon mapping for UI headings
   */
  private readonly categoryIcons: Record<string, string> = {
    GRAOS_E_CEREAIS: 'grain',
    HORTIFRUTI_FRESCOS: 'nutrition',
    PROTEINAS_CARNES: 'set_meal',
    LATICINIOS_MATINAIS: 'egg_alt',
    HIGIENE_COZINHA: 'cleaning_services',
    OUTROS: 'inventory_2',
  };

  /**
   * Computed list of products grouped by category in display order
   */
  readonly groupedProducts = computed<CategoryGroup[]>(() => {
    const activeProducts = this._products().filter((p) => p.active !== false);
    const groupsMap = new Map<string, CategoryGroup>();

    for (const prod of activeProducts) {
      const catKey = prod.category || 'OUTROS';
      const catName = prod.categoryDisplayName || 'Outros Itens';

      if (!groupsMap.has(catKey)) {
        groupsMap.set(catKey, {
          category: catKey,
          categoryDisplayName: catName,
          iconName: this.categoryIcons[catKey] || 'category',
          products: [],
        });
      }

      groupsMap.get(catKey)!.products.push(prod);
    }

    return Array.from(groupsMap.values());
  });

  /**
   * Fetches the products from GET /api/v1/products.
   * If backend is unreachable, falls back to institutional default catalog.
   */
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

    return items.map((item) => ({
      ...item,
      step: item.step ?? this.getDefaultStepForUnit(item.unitMeasure),
      categoryDisplayName: item.categoryDisplayName ?? this.formatCategoryName(item.category),
    }));
  }

  private getDefaultStepForUnit(unit?: string): number {
    const normalized = (unit || '').toUpperCase();
    if (normalized === 'KG') return 1;
    if (normalized.includes('500G') || normalized.includes('PCT')) return 1;
    if (normalized === 'LITRO' || normalized === 'L') return 1;
    return 1;
  }

  private formatCategoryName(category?: string): string {
    switch (category) {
      case 'GRAOS_E_CEREAIS':
        return 'Grãos e Cereais';
      case 'HORTIFRUTI_FRESCOS':
        return 'Hortifrúti e Frescos';
      case 'PROTEINAS_CARNES':
        return 'Proteínas e Carnes';
      case 'LATICINIOS_MATINAIS':
        return 'Laticínios e Matinais';
      case 'HIGIENE_COZINHA':
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
        unitMeasure: 'kg',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Grão longo beneficiado • Fardos fechados',
        active: true,
        step: 5,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBudBOFkGUvDGVmijwPmbK68VYT1W4YXY_RF9ys8wYC15oN4SrO35g91FZd_EKC8sZPJgKtZe_QEnO4oPj3zvRp1T5VxIy288mR9ZylQuutKsicrjc6I_Uh1-_Nj43CKmRVbNTLJ0Nlq9tgU40s5_ZVLwUcvd9GlPux8ek-d7tEBZu-Djot_rSjznrnQCiUxn0Raf3ph50E13GIpeMeRV9gjVsy2xjcnJO-vIXXYgfEXi1p9AsWi1Ijsg',
      },
      {
        id: 'feijao-carioca-uuid',
        name: 'Feijão Carioca',
        unitMeasure: 'kg',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Safra nova selecionada • Alto rendimento',
        active: true,
        step: 5,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDjLWanjGCsjEj6DghPXQVkbVdW2GGFR8jTg7dBb_6K2rmWblXcLpPvkdBliZ5UFDIVbYf-Fmj_4mwiCjEM67uqo0d8jXVgvFHn7izReDs_rQHIoMlC6XxVxsOHrjkz1kLYj3mLFecr3Cp4fIEeM6slKokG68wUUuT3QNxAYFCZf1_QTij3UvIeycGJeBHm3yuZqH_8BeaD1BmwmuOjpIBVCuK7St4kjEYVVLb8NzvdeB04UlGQBYa6uA',
      },
      {
        id: 'macarrao-espaguete-uuid',
        name: 'Macarrão Espaguete',
        unitMeasure: 'pct 500g',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Sêmola com ovos • Pacote lacrado',
        active: true,
        step: 2,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuALEbLuOKpzeORNFBLXu3GezikitpsSSplkpRD-dreaWJ0agXJFV5-zVf4yBweuujML41EeHEsb5KQGJh6ffB0mbFTfE43hKhhNWcCN0ukEWQRMnidkOGEesKCt067nrISDvmdXoMMAA0FaSWVf6AadsjYDkwog3BtbD2YPVcKp25nEBQRXtwJOH0wbRDmXydcxcx367Lf_HhuiyD9EvQwmlFikGPMquEr4VKl5hVEtrM4hFcz9d304pw',
      },
      {
        id: 'oleo-soja-uuid',
        name: 'Óleo de Soja',
        unitMeasure: 'litro',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Refinado 900ml/1L pet',
        active: true,
        step: 1,
      },
      {
        id: 'acucar-cristal-uuid',
        name: 'Açúcar Cristal',
        unitMeasure: 'kg',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Alimentício padrão especial',
        active: true,
        step: 2,
      },
      {
        id: 'sal-refinado-uuid',
        name: 'Sal Refinado',
        unitMeasure: 'kg',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Iodado para culinária',
        active: true,
        step: 1,
      },
      {
        id: 'farinha-trigo-uuid',
        name: 'Farinha de Trigo',
        unitMeasure: 'kg',
        category: 'GRAOS_E_CEREAIS',
        categoryDisplayName: 'Grãos e Cereais',
        description: 'Tipo 1 tradicional fortificada com ferro',
        active: true,
        step: 1,
      },
      {
        id: 'leite-integral-uuid',
        name: 'Leite Integral UHT',
        unitMeasure: 'litro',
        category: 'LATICINIOS_MATINAIS',
        categoryDisplayName: 'Laticínios e Matinais',
        description: 'Caixa Tetra Pak 1L • Fonte de cálcio',
        active: true,
        step: 6,
      },
      {
        id: 'f5b9c3d4-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
        name: 'Detergente Neutro',
        unitMeasure: 'frasco 500ml',
        category: 'HIGIENE_COZINHA',
        categoryDisplayName: 'Higiene & Limpeza da Cozinha',
        description: 'Lava-louças biodegradável',
        active: true,
        step: 2,
      },
      {
        id: 'agua-sanitaria-uuid',
        name: 'Água Sanitária',
        unitMeasure: 'litro',
        category: 'HIGIENE_COZINHA',
        categoryDisplayName: 'Higiene & Limpeza da Cozinha',
        description: 'Solução clorada hospitalar/refeitório',
        active: true,
        step: 1,
      },
      {
        id: 'esponja-multiuso-uuid',
        name: 'Esponja Multiuso',
        unitMeasure: 'pacote',
        category: 'HIGIENE_COZINHA',
        categoryDisplayName: 'Higiene & Limpeza da Cozinha',
        description: 'Dupla face abrasiva (pacote c/ 3 un)',
        active: true,
        step: 1,
      },
    ];
  }
}
