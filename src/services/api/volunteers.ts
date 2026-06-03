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
    .select('*')
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
    .eq('sectorId', sectorId)
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function fetchFollowUpProfiles(volunteerId?: string) {
  let query = supabase.from('followUpProfiles').select('*');

  if (volunteerId) {
    query = query.eq('volunteerId', volunteerId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// ============ Mutation Functions ============

export async function createVolunteer(volunteer: Omit<Volunteer, 'id'>) {
  const { data, error } = await supabase
    .from('volunteers')
    .insert([volunteer])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateVolunteer(id: string, updates: Partial<Volunteer>) {
  const { data, error } = await supabase
    .from('volunteers')
    .update(updates)
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

export async function createFollowUpProfile(profile: Omit<FollowUpProfile, 'id'>) {
  const { data, error } = await supabase
    .from('followUpProfiles')
    .insert([profile])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateFollowUpProfile(id: string, updates: Partial<FollowUpProfile>) {
  const { data, error } = await supabase
    .from('followUpProfiles')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
