export type UserRole =
  | 'governorate_supervisor'
  | 'unit_director'
  | 'evaluation_committee'
  | 'sector_manager'
  | 'neighborhood_coordinator'
  | 'volunteer';

export type VolunteerStatus = 'active' | 'inactive' | 'pending';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: VolunteerStatus;
  sectorId: string;
  neighborhoodId: string;
  avatar: string;
  qrCode: string;
  eventsAttended: number;
  hoursTotal: number;
  joinDate: string;
}

export interface FollowUpProfile {
  id: string;
  volunteerId: string;
  participationLevel: string;
  commitmentLevel: string;
  teammateStatus: string;
  communicationSkill: string;
  leadershipPotential: string;
  recommendation: string;
  notes: string;
  lastUpdated: string;
}
