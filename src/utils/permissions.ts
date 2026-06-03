import { users, volunteers, sectors, neighborhoods, type UserRole } from '../data';

export interface AuthContext {
  userId: string;
  role: UserRole;
  sectorId?: string;
  neighborhoodId?: string;
}

export function getAuthContext(userId: string): AuthContext | null {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  return {
    userId: user.id,
    role: user.role,
    sectorId: user.sectorId,
    neighborhoodId: user.neighborhoodId,
  };
}

export function canViewVolunteer(auth: AuthContext | null, volunteerId: string): boolean {
  if (!auth) return false;
  if (auth.role === 'governorate_supervisor' || auth.role === 'unit_director') return true;
  if (auth.role === 'evaluation_committee') return true;

  const vol = volunteers.find(v => v.id === volunteerId);
  if (!vol) return false;

  if (auth.role === 'sector_manager') return vol.sectorId === auth.sectorId;
  if (auth.role === 'neighborhood_coordinator') return vol.neighborhoodId === auth.neighborhoodId;
  if (auth.role === 'volunteer') return volunteerId === auth.userId;

  return false;
}

export function filterVolunteersByRole(auth: AuthContext | null): typeof volunteers {
  if (!auth) return [];
  if (auth.role === 'governorate_supervisor' || auth.role === 'unit_director') return volunteers;
  if (auth.role === 'evaluation_committee') return volunteers;

  if (auth.role === 'sector_manager') {
    return volunteers.filter(v => v.sectorId === auth.sectorId);
  }
  if (auth.role === 'neighborhood_coordinator') {
    return volunteers.filter(v => v.neighborhoodId === auth.neighborhoodId);
  }
  if (auth.role === 'volunteer') {
    return volunteers.filter(v => v.id === auth.userId);
  }

  return [];
}

export function filterEventsByRole(auth: AuthContext | null, events: any[]): any[] {
  if (!auth) return [];
  if (auth.role === 'governorate_supervisor' || auth.role === 'unit_director') return events;
  if (auth.role === 'evaluation_committee') return events;

  if (auth.role === 'sector_manager') {
    return events.filter(e => e.sectorId === auth.sectorId);
  }
  if (auth.role === 'neighborhood_coordinator') {
    return events.filter(e => e.neighborhoodId === auth.neighborhoodId);
  }
  if (auth.role === 'volunteer') {
    return events;
  }

  return [];
}

export function getDashboardDataForRole(auth: AuthContext | null) {
  if (!auth) return null;

  const filteredVols = filterVolunteersByRole(auth);
  const activeVols = filteredVols.filter(v => v.status === 'active');
  const totalHours = filteredVols.reduce((s, v) => s + v.hoursTotal, 0);
  const pendingVols = filteredVols.filter(v => v.status === 'pending');

  let sector, neighborhood;
  if (auth.sectorId) sector = sectors.find(s => s.id === auth.sectorId);
  if (auth.neighborhoodId) neighborhood = neighborhoods.find(n => n.id === auth.neighborhoodId);

  return {
    filteredVols,
    activeVols: activeVols.length,
    totalVols: filteredVols.length,
    totalHours,
    pendingVols: pendingVols.length,
    sector,
    neighborhood,
  };
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    governorate_supervisor: 'رؤية كاملة لجميع القطاعات والأحياء والمتطوعين',
    unit_director: 'إدارة جميع الوحدات والقطاعات التابعة',
    evaluation_committee: 'تقييم وتتبع أداء المتطوعين فقط',
    sector_manager: 'إدارة قطاع محدد والأحياء التابعة له',
    neighborhood_coordinator: 'إدارة حي محدد والمتطوعين فيه',
    volunteer: 'عرض الفعاليات والمشاركة فيها فقط',
  };
  return descriptions[role];
}
