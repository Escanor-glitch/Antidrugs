export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  sectorId: string;
  neighborhoodId: string;
  status: EventStatus;
  volunteersNeeded: number;
  volunteersRegistered: number;
}

export interface AttendanceRecord {
  id: string;
  volunteerId: string;
  eventId: string;
  timestamp: string;
  scannedBy: string;
  scannedByName: string;
  status: AttendanceStatus;
}

export interface Sector {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  description: string;
  neighborhoods: string[];
  volunteersCount: number;
  eventsCount: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  sectorId: string;
  coordinatorId: string;
  coordinatorName: string;
  volunteersCount: number;
  eventsCount: number;
}
