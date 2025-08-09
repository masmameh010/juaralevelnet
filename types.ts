
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SALES = 'SALES',
}

export enum InterestLevel {
  TINGGI = 'Tinggi',
  SEDANG = 'Sedang',
  RENDAH = 'Rendah',
  MENOLAK_POSM = 'Menolak Diberi POSM',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string; // Password is optional, will not be stored in state/localStorage
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface VisitReport {
  id: string;
  salesPerson: User;
  timestamp: string;
  location: LocationData;
  customerName: string;
  interestLevel: InterestLevel;
  phoneNumber?: string;
  notes: string;
}

export interface Customer {
  id: string;
  registeredBy: User;
  registrationDate: string;
  customerName: string;
  businessName?: string;
  phoneNumber: string;
  email?: string;
  address: string;
  notes?: string;
}
