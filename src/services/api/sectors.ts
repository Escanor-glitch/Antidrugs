import { supabase } from '../supabase/supabaseClient';

// ============ Sectors ============

export async function fetchSectors() {
  const { data, error } = await supabase
    .from('sectors')
    .select(`
      *,
      manager:users(id, email, full_name),
      neighborhoods:neighborhoods(*)
    `)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchSectorById(id: string) {
  const { data, error } = await supabase
    .from('sectors')
    .select(`
      *,
      manager:users(id, email, full_name),
      neighborhoods:neighborhoods(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createSector(sector: {
  name: string;
  description?: string;
  manager_id?: string;
}) {
  const { data, error } = await supabase
    .from('sectors')
    .insert([sector])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateSector(
  id: string,
  updates: {
    name?: string;
    description?: string;
    manager_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('sectors')
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

export async function deleteSector(id: string) {
  const { error } = await supabase
    .from('sectors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ Neighborhoods ============

export async function fetchNeighborhoods() {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select(`
      *,
      sector:sectors(id, name),
      coordinator:users(id, email, full_name)
    `)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchNeighborhoodsBySector(sectorId: string) {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select(`
      *,
      coordinator:users(id, email, full_name)
    `)
    .eq('sector_id', sectorId)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchNeighborhoodById(id: string) {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select(`
      *,
      sector:sectors(id, name),
      coordinator:users(id, email, full_name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createNeighborhood(neighborhood: {
  name: string;
  sector_id: string;
  coordinator_id?: string;
}) {
  const { data, error } = await supabase
    .from('neighborhoods')
    .insert([neighborhood])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateNeighborhood(
  id: string,
  updates: {
    name?: string;
    coordinator_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('neighborhoods')
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

export async function deleteNeighborhood(id: string) {
  const { error } = await supabase
    .from('neighborhoods')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getSectorStats(sectorId: string) {
  const { data: neighborhoods, error: nError } = await supabase
    .from('neighborhoods')
    .select('id')
    .eq('sector_id', sectorId);

  if (nError) throw nError;

  const neighborhoodIds = neighborhoods?.map(n => n.id) || [];

  const { count: volunteersCount } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .in('neighborhood_id', neighborhoodIds);

  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('sector_id', sectorId);

  return {
    neighborhoods_count: neighborhoods?.length || 0,
    volunteers_count: volunteersCount || 0,
    events_count: eventsCount || 0,
  };
}
