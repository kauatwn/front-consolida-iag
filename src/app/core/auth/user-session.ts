import { ServiceCode } from '../../weekly-request/weekly-request.model';

export interface UserDetailsResponse {
  id: string;
  firebaseUid?: string;
  email: string;
  name: string;
  role: 'KITCHEN_LEADER' | 'BUYER';
  serviceCode: ServiceCode | null;
  active?: boolean;
}

/**
 * User session model utilizing TypeScript Utility Types (Pick).
 * Derives common fields from UserDetailsResponse.
 */
export interface UserSession extends Pick<UserDetailsResponse, 'email' | 'role' | 'serviceCode'> {
  uid: string;
  name?: string;
}

/**
 * Readonly representation of the user session using TypeScript Utility Type (Readonly).
 */
export type ReadonlyUserSession = Readonly<UserSession>;
