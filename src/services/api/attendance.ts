import { supabase } from '../supabase/supabaseClient';

// ============ Fetch Functions ============

export async function fetchAttendance(eventId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      volunteer:volunteers(*),
      event:events(*)
    `)
    .eq('event_id', eventId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAttendanceByVolunteer(volunteerId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      event:events(*)
    `)
    .eq('volunteer_id', volunteerId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAttendanceRecord(volunteerId: string, eventId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('volunteer_id', volunteerId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchAttendanceStats(volunteerId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('status')
    .eq('volunteer_id', volunteerId);

  if (error) throw error;

  const records = data || [];
  return {
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    excused: records.filter(r => r.status === 'excused').length,
    total: records.length,
  };
}

// ============ Mutation Functions ============

export async function recordAttendance(
  volunteerId: string,
  eventId: string,
  status: 'present' | 'absent' | 'excused' = 'present',
  scannedBy?: string
) {
  // Check if attendance already exists
  const existing = await fetchAttendanceRecord(volunteerId, eventId);

  if (existing) {
    // Update existing record
    return updateAttendance(existing.id, { status });
  }

  // Create new attendance record
  const { data, error } = await supabase
    .from('attendance')
    .insert([{
      volunteer_id: volunteerId,
      event_id: eventId,
      status,
      timestamp: new Date().toISOString(),
      scanned_by: scannedBy,
    }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateAttendance(
  id: string,
  updates: {
    status?: 'present' | 'absent' | 'excused';
    timestamp?: string;
  }
) {
  const { data, error } = await supabase
    .from('attendance')
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

export async function deleteAttendance(id: string) {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function bulkRecordAttendance(
  eventId: string,
  attendanceRecords: Array<{
    volunteerId: string;
    status: 'present' | 'absent' | 'excused';
    scannedBy?: string;
  }>
) {
  const records = attendanceRecords.map(record => ({
    volunteer_id: record.volunteerId,
    event_id: eventId,
    status: record.status,
    timestamp: new Date().toISOString(),
    scanned_by: record.scannedBy,
  }));

  const { data, error } = await supabase
    .from('attendance')
    .upsert(records, { onConflict: 'volunteer_id,event_id' })
    .select();

  if (error) throw error;
  return data;
}

export async function getEventAttendanceReport(eventId: string) {
  const attendance = await fetchAttendance(eventId);

  return {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    excused: attendance.filter(a => a.status === 'excused').length,
    details: attendance,
  };
}
