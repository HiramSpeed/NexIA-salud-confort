
export enum SanitizationStatus {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'EN_PROCESO',
  CERTIFIED = 'CERTIFICADO',
  EXPIRED = 'EXPIRADO'
}

export enum UnitStatus {
  AVAILABLE = 'DISPONIBLE',
  RENTED = 'RENTADO',
  MAINTENANCE = 'MANTENIMIENTO',
  RETIRED = 'RETIRO'
}

export interface MedicalEquipment {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyRate: number;
  monthlyRate: number;
  images: string[]; // Changed from imageUrl: string to images: string[]
  features: string[];
}

export interface EquipmentUnit {
  serialNumber: string;
  equipmentId: string;
  status: UnitStatus;
  lastSanitizationDate: string;
  sanitizationStatus: SanitizationStatus;
  sanitizedBy: string;
}

export interface RentalBooking {
  id: string;
  unitSerialNumber: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ComplianceState {
  hasConsentedPrivacy: boolean;
  documentsUploaded: boolean;
  ineFront?: string;
  proofOfAddress?: string;
}
