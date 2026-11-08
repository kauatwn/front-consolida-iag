export type ProductCategory =
  | 'GRAOS_E_CEREAIS'
  | 'HORTIFRUTI_FRESCOS'
  | 'PROTEINAS_CARNES'
  | 'LATICINIOS_MATINAIS'
  | 'HIGIENE_COZINHA'
  | 'OUTROS';

export interface CatalogProduct {
  id: string;
  name: string;
  unitMeasure: string;
  category: ProductCategory | string;
  categoryDisplayName: string;
  active: boolean;
  description?: string;
  step?: number;
  imageUrl?: string;
}

export interface CategoryGroup {
  category: string;
  categoryDisplayName: string;
  iconName: string;
  products: CatalogProduct[];
}
