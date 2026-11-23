export const ProductCategory = {
  GRAOS_E_CEREAIS: 'GRAOS_E_CEREAIS',
  PROTEINAS_CARNES: 'PROTEINAS_CARNES',
  HORTIFRUTI_FRESCOS: 'HORTIFRUTI_FRESCOS',
  LATICINIOS_DERIVADOS: 'LATICINIOS_DERIVADOS',
  MERCEARIA_PANIFICACAO: 'MERCEARIA_PANIFICACAO',
} as const;

export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];

export const CATEGORY_LABELS: Record<string, string> = {
  GRAOS_E_CEREAIS: 'Grãos e Cereais',
  PROTEINAS_CARNES: 'Proteínas e Carnes',
  HORTIFRUTI_FRESCOS: 'Hortifrúti e Frescos',
  LATICINIOS_DERIVADOS: 'Laticínios e Derivados',
  MERCEARIA_PANIFICACAO: 'Mercearia e Panificação',
};

export const UnitMeasure = {
  KG: 'KG',
  L: 'L',
  UN: 'UN',
  PCT: 'PCT',
} as const;

export type UnitMeasure = (typeof UnitMeasure)[keyof typeof UnitMeasure];

export const UNIT_MEASURE_LABELS: Record<string, string> = {
  KG: 'Kg',
  L: 'Litro',
  UN: 'Unidade',
  PCT: 'Pacote',
};

export interface CatalogProduct {
  id: string;
  name: string;
  unitMeasure: UnitMeasure | string;
  category: ProductCategory | string;
  categoryDisplayName?: string;
  active?: boolean;
}

export type ActiveProductSummary = Pick<CatalogProduct, 'id' | 'name' | 'unitMeasure' | 'category'>;

export type CreateCatalogProduct = Omit<CatalogProduct, 'id' | 'categoryDisplayName'>;

export interface CategoryGroup {
  category: string;
  categoryDisplayName: string;
  products: CatalogProduct[];
}
