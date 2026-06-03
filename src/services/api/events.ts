import { supabase } from '../supabase/supabaseClient';

// ============ Fetch Functions ============

export async function fetchEvents(limit: number = 20, offset: number = 0) {
  const { data, error, count } = await supabase
    .from('events')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('date', { ascending: false });

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function fetchEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      attendance:attendance(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchEventsBySector(sectorId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('sector_id', sectorId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchEventsByNeighborhood(neighborhoodId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('neighborhood_id', neighborhoodId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchEventsByStatus(status: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', status)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchUpcomingEvents() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', today)
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(10);

  if (error) throw error;
  return data || [];
}

// ============ Mutation Functions ============

export async function createEvent(event: {
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  sector_id: string;
  neighborhood_id: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}) {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      ...event,
      status: event.status || 'upcoming',
      volunteers_registered: 0,
    }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateEvent(
  id: string,
  updates: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    volunteers_registered?: number;
  }
) {
  const { data, error } = await supabase
    .from('events')
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

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateEventStatus(
  id: string,
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
) {
  const { data, error } = await supabase
    .from('events')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function incrementEventVolunteersRegistered(eventId: string) {
  const event = await fetchEventById(eventId);
  if (!event) throw new Error('Event not found');

  return updateEvent(eventId, {
    volunteers_registered: (event.volunteers_registered || 0) + 1,
  });
}
