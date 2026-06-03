// ============================================================================
// SUPABASE API QUICK-START EXAMPLES
// ============================================================================
// Copy and paste these examples into your components to use the database API
// ============================================================================

// ============ 1. AUTHENTICATION EXAMPLES ============

import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getCurrentUserProfile,
  updateUserProfile
} from '@/services/api/auth';

// Sign up new user
async function handleSignUp() {
  try {
    const user = await signUp(
      'volunteer@example.com',
      'SecurePassword123',
      'أحمد محمد',
      'volunteer'
    );
    console.log('User created:', user);
  } catch (error) {
    console.error('Sign up failed:', error.message);
  }
}

// Sign in
async function handleSignIn() {
  try {
    const { session } = await signIn('volunteer@example.com', 'SecurePassword123');
    console.log('Logged in:', session?.user?.email);
  } catch (error) {
    console.error('Sign in failed:', error.message);
  }
}

// Get current user
async function checkCurrentUser() {
  try {
    const user = await getCurrentUser();
    const profile = await getCurrentUserProfile();
    console.log('User:', user?.email);
    console.log('Role:', profile?.role);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============ 2. VOLUNTEER MANAGEMENT EXAMPLES ============

import {
  fetchVolunteers,
  fetchVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  fetchVolunteersByNeighborhood,
  generateVolunteerQRCode,
  updateVolunteerHours
} from '@/services/api/volunteers';

// Fetch all volunteers with pagination
async function loadVolunteers() {
  try {
    const { data: volunteers, total } = await fetchVolunteers(20, 0);
    console.log(`Loaded ${volunteers.length} of ${total} volunteers`);
  } catch (error) {
    console.error('Error loading volunteers:', error.message);
  }
}

// Create a new volunteer
async function addVolunteer() {
  try {
    const newVolunteer = await createVolunteer({
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      phone: '+966501234567',
      sector_id: 'sector-uuid-here',
      neighborhood_id: 'neighborhood-uuid-here',
      status: 'active'
    });
    console.log('Volunteer created:', newVolunteer.id);
  } catch (error) {
    console.error('Error creating volunteer:', error.message);
  }
}

// Update volunteer information
async function editVolunteer(volunteerId: string) {
  try {
    const updated = await updateVolunteer(volunteerId, {
      name: 'Updated Name',
      phone: '+966509876543',
      status: 'active'
    });
    console.log('Volunteer updated:', updated);
  } catch (error) {
    console.error('Error updating volunteer:', error.message);
  }
}

// Delete volunteer
async function removeVolunteer(volunteerId: string) {
  try {
    await deleteVolunteer(volunteerId);
    console.log('Volunteer deleted');
  } catch (error) {
    console.error('Error deleting volunteer:', error.message);
  }
}

// Generate QR code for volunteer
async function createQRCode(volunteerId: string) {
  try {
    const volunteer = await generateVolunteerQRCode(volunteerId);
    console.log('QR Code:', volunteer.qr_code);
  } catch (error) {
    console.error('Error generating QR code:', error.message);
  }
}

// Update volunteer hours
async function addVolunteerHours(volunteerId: string, hours: number) {
  try {
    const updated = await updateVolunteerHours(volunteerId, hours);
    console.log('Total hours:', updated.hours_volunteered);
  } catch (error) {
    console.error('Error updating hours:', error.message);
  }
}

// ============ 3. EVENT MANAGEMENT EXAMPLES ============

import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  fetchUpcomingEvents
} from '@/services/api/events';

// Fetch all events
async function loadEvents() {
  try {
    const { data: events, total } = await fetchEvents(20, 0);
    console.log(`Loaded ${events.length} events`);
  } catch (error) {
    console.error('Error loading events:', error.message);
  }
}

// Create new event
async function addEvent() {
  try {
    const newEvent = await createEvent({
      title: 'تنظيف الحي',
      description: 'حملة تنظيف الحي الشهرية',
      date: '2024-12-15',
      time: '09:00',
      location: 'شارع الملك',
      sector_id: 'sector-uuid-here',
      neighborhood_id: 'neighborhood-uuid-here',
      status: 'upcoming'
    });
    console.log('Event created:', newEvent.id);
  } catch (error) {
    console.error('Error creating event:', error.message);
  }
}

// Update event
async function editEvent(eventId: string) {
  try {
    const updated = await updateEvent(eventId, {
      title: 'Updated Title',
      status: 'ongoing'
    });
    console.log('Event updated:', updated);
  } catch (error) {
    console.error('Error updating event:', error.message);
  }
}

// Delete event
async function removeEvent(eventId: string) {
  try {
    await deleteEvent(eventId);
    console.log('Event deleted');
  } catch (error) {
    console.error('Error deleting event:', error.message);
  }
}

// Get upcoming events
async function showUpcomingEvents() {
  try {
    const events = await fetchUpcomingEvents();
    console.log('Upcoming events:', events.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============ 4. ATTENDANCE TRACKING EXAMPLES ============

import {
  recordAttendance,
  fetchAttendance,
  fetchAttendanceStats,
  updateAttendance,
  getEventAttendanceReport
} from '@/services/api/attendance';

// Record volunteer attendance
async function markPresent(volunteerId: string, eventId: string) {
  try {
    const attendance = await recordAttendance(
      volunteerId,
      eventId,
      'present',
      'scanner-user-id' // ID of person scanning
    );
    console.log('Attendance recorded:', attendance.id);
  } catch (error) {
    console.error('Error recording attendance:', error.message);
  }
}

// Fetch attendance for event
async function viewEventAttendance(eventId: string) {
  try {
    const records = await fetchAttendance(eventId);
    console.log('Attendance records:', records.length);
  } catch (error) {
    console.error('Error fetching attendance:', error.message);
  }
}

// Get volunteer attendance statistics
async function showAttendanceStats(volunteerId: string) {
  try {
    const stats = await fetchAttendanceStats(volunteerId);
    console.log('Stats:', {
      present: stats.present,
      absent: stats.absent,
      excused: stats.excused,
      total: stats.total
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
  }
}

// Update attendance status
async function updateAttendanceStatus(attendanceId: string) {
  try {
    const updated = await updateAttendance(attendanceId, {
      status: 'excused'
    });
    console.log('Attendance updated:', updated);
  } catch (error) {
    console.error('Error updating attendance:', error.message);
  }
}

// Get attendance report for event
async function generateEventReport(eventId: string) {
  try {
    const report = await getEventAttendanceReport(eventId);
    console.log('Report:', {
      total: report.total,
      present: report.present,
      absent: report.absent,
      excused: report.excused
    });
  } catch (error) {
    console.error('Error generating report:', error.message);
  }
}

// ============ 5. SECTOR & NEIGHBORHOOD EXAMPLES ============

import {
  fetchSectors,
  fetchNeighborhoods,
  createSector,
  createNeighborhood,
  updateSector,
  updateNeighborhood,
  deleteSector,
  deleteNeighborhood,
  getSectorStats
} from '@/services/api/sectors';

// Fetch all sectors
async function loadSectors() {
  try {
    const sectors = await fetchSectors();
    console.log('Sectors:', sectors);
  } catch (error) {
    console.error('Error loading sectors:', error.message);
  }
}

// Create new sector
async function addSector() {
  try {
    const sector = await createSector({
      name: 'الصحة والرفاهية',
      description: 'قطاع الصحة والخدمات الاجتماعية',
      manager_id: 'manager-uuid-here'
    });
    console.log('Sector created:', sector.id);
  } catch (error) {
    console.error('Error creating sector:', error.message);
  }
}

// Create neighborhood in sector
async function addNeighborhood(sectorId: string) {
  try {
    const neighborhood = await createNeighborhood({
      name: 'الحي القديم',
      sector_id: sectorId,
      coordinator_id: 'coordinator-uuid-here'
    });
    console.log('Neighborhood created:', neighborhood.id);
  } catch (error) {
    console.error('Error creating neighborhood:', error.message);
  }
}

// Get sector statistics
async function showSectorStats(sectorId: string) {
  try {
    const stats = await getSectorStats(sectorId);
    console.log('Stats:', {
      neighborhoods: stats.neighborhoods_count,
      volunteers: stats.volunteers_count,
      events: stats.events_count
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
  }
}

// ============ 6. FOLLOW-UP PROFILE EXAMPLES ============

import {
  fetchFollowUpProfiles,
  createFollowUpProfile,
  updateFollowUpProfile
} from '@/services/api/volunteers';

// Create follow-up profile
async function createAssessment(volunteerId: string) {
  try {
    const profile = await createFollowUpProfile({
      volunteer_id: volunteerId,
      participation_level: 'مشارك بفاعلية',
      commitment_level: 'ملتزم جداً',
      teammate_collaboration: 'متعاون جداً',
      communication_skill: 'ممتازة',
      leadership_potential: 'مرشح للقيادة',
      recommendation: 'مرشح للتكريم',
      notes: 'متطوع استثنائي',
      assessed_by: 'assessor-uuid-here'
    });
    console.log('Profile created:', profile.id);
  } catch (error) {
    console.error('Error creating profile:', error.message);
  }
}

// Fetch follow-up profiles for volunteer
async function showVolunteerProfiles(volunteerId: string) {
  try {
    const profiles = await fetchFollowUpProfiles(volunteerId);
    console.log('Follow-up profiles:', profiles.length);
  } catch (error) {
    console.error('Error fetching profiles:', error.message);
  }
}

// ============ 7. ERROR HANDLING EXAMPLE ============

async function safeOperation() {
  try {
    // Try to fetch volunteer
    const volunteer = await fetchVolunteerById('invalid-id');
    console.log('Volunteer:', volunteer);
  } catch (error: any) {
    // Handle different types of errors
    if (error.message.includes('no rows')) {
      console.error('Volunteer not found');
    } else if (error.message.includes('permission')) {
      console.error('Permission denied');
    } else {
      console.error('Unknown error:', error.message);
    }
  }
}

// ============================================================================
// Use these examples in your React components with proper state management
// and error handling for production applications.
// ============================================================================
