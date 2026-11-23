import { ServiceCode } from '../../weekly-request/weekly-request.model';

export interface UserSession {
  uid: string;
  email: string;
  name?: string;
  serviceCode: ServiceCode | null;
  role: 'KITCHEN_LEADER' | 'BUYER';
}

export interface UserDetailsResponse {
  id: string;
  firebaseUid?: string;
  email: string;
  name: string;
  role: 'KITCHEN_LEADER' | 'BUYER';
  serviceCode: ServiceCode | null;
  active?: boolean;
}
