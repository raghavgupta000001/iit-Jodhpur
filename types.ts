
export enum IncidentType {
  ACCIDENT = 'Accident',
  MEDICAL = 'Medical',
  FIRE = 'Fire',
  CRIME = 'Public Safety',
  INFRASTRUCTURE = 'Infrastructure',
  OTHER = 'Other'
}

export enum IncidentStatus {
  UNVERIFIED = 'Unverified',
  VERIFIED = 'Verified',
  RESPONDING = 'Responding',
  RESOLVED = 'Resolved',
  FALSE_ALARM = 'False Alarm'
}

export enum Severity {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  CATASTROPHIC = 5
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  location: LocationData;
  timestamp: number;
  status: IncidentStatus;
  severity: Severity;
  upvotes: number;
  reporterId: string;
  mediaUrl?: string;
  internalNotes?: string[];
  isDuplicateOf?: string;
}

export interface UserRole {
  id: string;
  name: string;
  role: 'CITIZEN' | 'RESPONDER' | 'ADMIN';
}
