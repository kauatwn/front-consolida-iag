import { CatalogProduct, ProductCategory } from '../catalog/product.model';

export interface ServiceBreakdownItem {
  serviceCode: string;
  quantity: number;
}

/**
 * Consolidated product item leveraging TypeScript Utility Types (Pick).
 * Inherits 'category' and 'unitMeasure' types directly from CatalogProduct.
 */
export interface ConsolidatedItem extends Pick<CatalogProduct, 'category' | 'unitMeasure'> {
  productId: string;
  productName: string;
  totalQuantity: number;
  breakdown?: ServiceBreakdownItem[];
}

/**
 * Projection of a consolidated item using TypeScript Utility Type (Pick).
 */
export type ConsolidatedItemPreview = Pick<
  ConsolidatedItem,
  'productId' | 'productName' | 'totalQuantity'
>;

/**
 * Group of consolidated items organized by category.
 */
export interface ConsolidatedCategoryGroup {
  category: ProductCategory | string;
  categoryDisplayName: string;
  items: ConsolidatedItem[];
}

/**
 * Category group mapping utilizing TypeScript Utility Type (Record).
 */
export type ConsolidatedCategoryGroupMap = Record<string, ConsolidatedCategoryGroup>;

/**
 * Full consolidated report response from the backend.
 */
export interface ConsolidatedReport {
  cycleId: string;
  generatedAt: string;
  totalProductsCount: number;
  items: ConsolidatedItem[];
}

/**
 * Read-only representation of the consolidated report using TypeScript Utility Type (Readonly).
 */
export type ReadonlyConsolidatedReport = Readonly<ConsolidatedReport>;

/**
 * Search and category filter criteria for consolidation views.
 */
export interface ConsolidationFilterCriteria {
  searchQuery: string;
  selectedCategory: ProductCategory | 'all';
}

/**
 * Partial filter parameters using TypeScript Utility Type (Partial).
 */
export type PartialConsolidationFilter = Partial<ConsolidationFilterCriteria>;
