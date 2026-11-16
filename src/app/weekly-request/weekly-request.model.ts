import { CatalogProduct } from '../catalog/product.model';

export const ServiceCode = {
  CEI: 'CEI',
  CCA: 'CCA',
  CJ: 'CJ',
} as const;

export type ServiceCode = (typeof ServiceCode)[keyof typeof ServiceCode];

export interface ServiceDetail {
  code: ServiceCode;
  acronym: string;
  name: string;
  fullName: string;
}

export const INSTITUTIONAL_SERVICES: Record<ServiceCode, ServiceDetail> = {
  [ServiceCode.CEI]: {
    code: ServiceCode.CEI,
    acronym: 'CEI',
    name: 'Centro de Educação Infantil',
    fullName: 'CEI - Centro de Educação Infantil',
  },
  [ServiceCode.CCA]: {
    code: ServiceCode.CCA,
    acronym: 'CCA',
    name: 'Centro para Crianças e Adolescentes',
    fullName: 'CCA - Centro para Crianças e Adolescentes',
  },
  [ServiceCode.CJ]: {
    code: ServiceCode.CJ,
    acronym: 'CJ',
    name: 'Centro de Juventude',
    fullName: 'CJ - Centro de Juventude',
  },
};

export interface RequestItemPayload {
  productId: string;
  quantity: number;
}

export interface SubmitWeeklyRequestPayload {
  serviceCode: ServiceCode;
  observation?: string;
  items: RequestItemPayload[];
}

export interface SubmitWeeklyRequestResponse {
  id: string;
  serviceCode: ServiceCode;
  cycleId?: string;
  submissionDate?: string;
  itemsCount?: number;
}

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
}
