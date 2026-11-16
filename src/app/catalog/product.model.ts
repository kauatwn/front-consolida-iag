export const ProductCategory = {
  GRAOS_E_CEREAIS: 'GRAOS_E_CEREAIS',
  HORTIFRUTI_FRESCOS: 'HORTIFRUTI_FRESCOS',
  PROTEINAS_CARNES: 'PROTEINAS_CARNES',
  LATICINIOS_MATINAIS: 'LATICINIOS_MATINAIS',
  HIGIENE_COZINHA: 'HIGIENE_COZINHA',
  OUTROS: 'OUTROS',
} as const;

export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];

export const UnitMeasure = {
  KG: 'Kg',
  LITRO: 'Litro',
  PACOTE: 'Pacote',
  GRAMAS: 'Gramas',
  UNIDADE: 'Unidade',
} as const;

export type UnitMeasure = (typeof UnitMeasure)[keyof typeof UnitMeasure];

export interface CatalogProduct {
  id: string;
  name: string;
  unitMeasure: UnitMeasure | string;
  category: ProductCategory | string;
  categoryDisplayName: string;
  active: boolean;
  description?: string; // Short display description e.g. "500g", "1L", "1kg", "Fardo 5kg"
}

export interface CategoryGroup {
  category: string;
  categoryDisplayName: string;
  products: CatalogProduct[];
}
