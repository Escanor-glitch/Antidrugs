import { supabase } from '../supabase/supabaseClient';
import type { Volunteer, FollowUpProfile } from '../../types';

// ============ Fetch Functions ============

export async function fetchVolunteers(limit: number = 20, offset: number = 0) {
  const { data, error, count } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function fetchVolunteerById(id: string) {
  const { data, error } = await supabase
    .from('volunteers')
    .select(`
      *,
      follow_up_files:volunteer_follow_up_files(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchVolunteersByStatus(status: string, limit: number = 20, offset: number = 0) {
  const { data, error, count } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .eq('status', status)
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function fetchVolunteersBySector(sectorId: string, limit: number = 20, offset: number = 0) {
  const { data, error, count } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .eq('sector_id', sectorId)
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function fetchVolunteersByNeighborhood(neighborhoodId: string) {
  const { data, error } = await supabase
    .from('volunteers')
    .select('*')
    .eq('neighborhood_id', neighborhoodId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function fetchFollowUpProfiles(volunteerId?: string) {
  let query = supabase.from('volunteer_follow_up_files').select('*');

  if (volunteerId) {
    query = query.eq('volunteer_id', volunteerId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// ============ Mutation Functions ============

export async function createVolunteer(volunteer: {
  name: string;
  email: string;
  phone?: string;
  sector_id: string;
  neighborhood_id: string;
  status?: 'active' | 'inactive' | 'pending';
  qr_code?: string;
}) {
  const { data, error } = await supabase
    .from('volunteers')
    .insert([{
      ...volunteer,
      status: volunteer.status || 'pending',
      hours_volunteered: 0,
      events_attended: 0,
    }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateVolunteer(id: string, updates: Partial<Volunteer>) {
  const { data, error } = await supabase
    .from('volunteers')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteVolunteer(id: string) {
  const { error } = await supabase
    .from('volunteers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createFollowUpProfile(profile: {
  volunteer_id: string;
  participation_level?: string;
  commitment_level?: string;
  teammate_collaboration?: string;
  communication_skill?: string;
  leadership_potential?: string;
  recommendation?: string;
  notes?: string;
  assessed_by?: string;
  assessment_date?: string;
}) {
  const { data, error } = await supabase
    .from('volunteer_follow_up_files')
    .insert([{
      ...profile,
      assessment_date: profile.assessment_date || new Date().toISOString().split('T')[0],
    }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateFollowUpProfile(id: string, updates: Partial<FollowUpProfile>) {
  const { data, error } = await supabase
    .from('volunteer_follow_up_files')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ============ Additional Utility Functions ============

export async function updateVolunteerHours(volunteerId: string, hoursToAdd: number) {
  const volunteer = await fetchVolunteerById(volunteerId);
  if (!volunteer) throw new Error('Volunteer not found');

  const { data, error } = await supabase
    .from('volunteers')
    .update({
      hours_volunteered: (volunteer.hours_volunteered || 0) + hoursToAdd,
      updated_at: new Date().toISOString(),
    })
    .eq('id', volunteerId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function generateVolunteerQRCode(volunteerId: string) {
  const qrCode = `VOL_${volunteerId.substring(0, 8).toUpperCase()}_${Date.now()}`;

  const { data, error } = await supabase
    .from('volunteers')
    .update({ qr_code: qrCode })
    .eq('id', volunteerId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
