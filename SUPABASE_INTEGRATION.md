# Supabase Integration - Complete Implementation Guide

## Overview

The Volunteer Management System is fully integrated with Supabase for persistent data storage. All CRUD operations, authentication, and real-time data management are implemented and ready to use.

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY (auth.users.id),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

**Roles:** governorate_supervisor, unit_director, evaluation_committee, sector_manager, neighborhood_coordinator, volunteer

### 2. Volunteers Table
```sql
CREATE TABLE volunteers (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  sector_id UUID REFERENCES sectors(id),
  neighborhood_id UUID REFERENCES neighborhoods(id),
  status volunteer_status,
  qr_code TEXT UNIQUE,
  hours_volunteered INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

### 3. Sectors Table
```sql
CREATE TABLE sectors (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  manager_id UUID REFERENCES users(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

### 4. Neighborhoods Table
```sql
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  sector_id UUID NOT NULL REFERENCES sectors(id),
  coordinator_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

### 5. Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  sector_id UUID NOT NULL REFERENCES sectors(id),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
  status event_status DEFAULT 'upcoming',
  volunteers_registered INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

### 6. Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  volunteer_id UUID NOT NULL REFERENCES volunteers(id),
  event_id UUID NOT NULL REFERENCES events(id),
  status attendance_status DEFAULT 'present',
  timestamp TIMESTAMP DEFAULT now(),
  scanned_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(volunteer_id, event_id)
)
```

### 7. Volunteer Follow-up Files Table
```sql
CREATE TABLE volunteer_follow_up_files (
  id UUID PRIMARY KEY,
  volunteer_id UUID NOT NULL REFERENCES volunteers(id),
  participation_level participation_level,
  commitment_level commitment_level,
  teammate_collaboration teammate_status,
  communication_skill communication_skill,
  leadership_potential leadership_potential,
  recommendation recommendation,
  notes TEXT,
  assessed_by UUID REFERENCES users(id),
  assessment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

## API Services

### Authentication Service (`src/services/api/auth.ts`)

```typescript
// Sign up new user
await signUp(email, password, fullName, role);

// Sign in
await signIn(email, password);

// Sign out
await signOut();

// Get current user
const user = await getCurrentUser();

// Get user profile
const profile = await getCurrentUserProfile();

// Update user profile
await updateUserProfile(userId, { full_name, role });

// Reset password
await resetPassword(email);

// Update password
await updatePassword(newPassword);

// Fetch all users
await fetchUsers();

// Fetch users by role
await fetchUsersByRole('sector_manager');
```

### Volunteer Service (`src/services/api/volunteers.ts`)

```typescript
// Fetch paginated volunteers
const { data, total } = await fetchVolunteers(limit, offset);

// Fetch single volunteer
const volunteer = await fetchVolunteerById(volunteerId);

// Create volunteer
await createVolunteer({
  name: 'Ahmed',
  email: 'ahmed@example.com',
  phone: '123456789',
  sector_id: sectorId,
  neighborhood_id: neighborhoodId,
  status: 'active'
});

// Update volunteer
await updateVolunteer(volunteerId, {
  name: 'Updated Name',
  status: 'active'
});

// Delete volunteer
await deleteVolunteer(volunteerId);

// Fetch volunteers by sector
await fetchVolunteersBySector(sectorId);

// Fetch volunteers by neighborhood
await fetchVolunteersByNeighborhood(neighborhoodId);

// Fetch volunteers by status
await fetchVolunteersByStatus('active');

// Generate QR code
await generateVolunteerQRCode(volunteerId);

// Update volunteer hours
await updateVolunteerHours(volunteerId, 8); // Add 8 hours

// Fetch follow-up profiles
await fetchFollowUpProfiles(volunteerId);

// Create follow-up profile
await createFollowUpProfile({
  volunteer_id: volunteerId,
  participation_level: 'مشارك بفاعلية',
  commitment_level: 'ملتزم جداً',
  recommendation: 'مرشح للتكريم'
});

// Update follow-up profile
await updateFollowUpProfile(profileId, {
  participation_level: 'مشارك بانتظام'
});
```

### Event Service (`src/services/api/events.ts`)

```typescript
// Fetch all events
const { data, total } = await fetchEvents(limit, offset);

// Fetch single event
const event = await fetchEventById(eventId);

// Create event
await createEvent({
  title: 'Community Service',
  description: 'Neighborhood cleanup',
  date: '2024-12-15',
  time: '09:00',
  location: 'Main Street',
  sector_id: sectorId,
  neighborhood_id: neighborhoodId,
  status: 'upcoming'
});

// Update event
await updateEvent(eventId, {
  title: 'Updated Title',
  status: 'ongoing'
});

// Delete event
await deleteEvent(eventId);

// Update event status
await updateEventStatus(eventId, 'completed');

// Fetch events by sector
await fetchEventsBySector(sectorId);

// Fetch events by neighborhood
await fetchEventsByNeighborhood(neighborhoodId);

// Fetch events by status
await fetchEventsByStatus('upcoming');

// Fetch upcoming events
await fetchUpcomingEvents();

// Increment registered volunteers
await incrementEventVolunteersRegistered(eventId);
```

### Attendance Service (`src/services/api/attendance.ts`)

```typescript
// Record attendance
await recordAttendance(volunteerId, eventId, 'present', scannedBy);

// Fetch attendance for event
const attendance = await fetchAttendance(eventId);

// Fetch attendance by volunteer
const volunteerAttendance = await fetchAttendanceByVolunteer(volunteerId);

// Fetch single attendance record
const record = await fetchAttendanceRecord(volunteerId, eventId);

// Update attendance
await updateAttendance(attendanceId, { status: 'absent' });

// Delete attendance
await deleteAttendance(attendanceId);

// Get attendance stats
const stats = await fetchAttendanceStats(volunteerId);
// Returns: { present: 5, absent: 1, excused: 0, total: 6 }

// Bulk record attendance
await bulkRecordAttendance(eventId, [
  { volunteerId: 'vol1', status: 'present' },
  { volunteerId: 'vol2', status: 'absent' }
]);

// Get event attendance report
const report = await getEventAttendanceReport(eventId);
// Returns: { total, present, absent, excused, details }
```

### Sectors & Neighborhoods Service (`src/services/api/sectors.ts`)

```typescript
// Fetch all sectors
const sectors = await fetchSectors();

// Fetch sector by ID
const sector = await fetchSectorById(sectorId);

// Create sector
await createSector({
  name: 'Health Sector',
  description: 'Healthcare and wellness',
  manager_id: managerId
});

// Update sector
await updateSector(sectorId, { name: 'Updated Name' });

// Delete sector
await deleteSector(sectorId);

// Fetch neighborhoods
const neighborhoods = await fetchNeighborhoods();

// Fetch neighborhoods by sector
const sectorNeighborhoods = await fetchNeighborhoodsBySector(sectorId);

// Fetch neighborhood by ID
const neighborhood = await fetchNeighborhoodById(neighborhoodId);

// Create neighborhood
await createNeighborhood({
  name: 'Downtown',
  sector_id: sectorId,
  coordinator_id: coordinatorId
});

// Update neighborhood
await updateNeighborhood(neighborhoodId, {
  name: 'Updated Name',
  coordinator_id: newCoordinatorId
});

// Delete neighborhood
await deleteNeighborhood(neighborhoodId);

// Get sector statistics
const stats = await getSectorStats(sectorId);
// Returns: { neighborhoods_count, volunteers_count, events_count }
```

## Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

### Users Table
- Users can view their own profile
- Admins can view all users

### Volunteers Table
- Volunteers can view their own profile
- Coordinators can view their sector's volunteers
- Managers can create, update, and delete volunteers

### Events Table
- All authenticated users can view events
- Coordinators can create and update their events
- Only managers can delete events

### Attendance Table
- Coordinators can view attendance
- Coordinators can record and update attendance

### Volunteer Follow-up Files Table
- Volunteers can view their own files
- Evaluation committee can view, create, and update files

## Integration with Components

### Example: Create Volunteer Form

```typescript
import { createVolunteer } from '@/services/api/volunteers';
import { useState } from 'react';

function CreateVolunteerForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      const volunteer = await createVolunteer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        sector_id: formData.sectorId,
        neighborhood_id: formData.neighborhoodId,
      });
      console.log('Volunteer created:', volunteer);
      // Redirect or refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

## Environment Variables

Add to `.env`:

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For admin operations
```

## Error Handling

All API functions throw errors that should be caught:

```typescript
try {
  const volunteer = await createVolunteer(data);
} catch (error) {
  console.error('Error creating volunteer:', error.message);
  // Handle error - show user message, etc.
}
```

## Real-time Subscriptions

Subscribe to real-time data changes:

```typescript
const subscription = supabase
  .from('volunteers')
  .on('*', payload => {
    console.log('Change:', payload);
  })
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

## Performance Considerations

1. **Pagination**: Use pagination for large datasets (implemented)
2. **Indexes**: All foreign keys have indexes for fast queries
3. **RLS**: Enables fine-grained access control
4. **Caching**: Consider React Query for client-side caching (prepared)
5. **Real-time**: Use subscriptions for live updates

## Testing

Test the integration:

```bash
npm run dev
```

1. Sign up for an account
2. Create a volunteer
3. Create an event
4. Record attendance
5. View reports

## Deployment

When deploying to production:

1. Use environment variables for credentials (never hardcode)
2. Enable HTTPS only
3. Set up CORS policies in Supabase
4. Enable authentication email verification
5. Configure custom email templates
6. Set up backups and recovery procedures

## Support & Documentation

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript
- API Reference: https://supabase.com/docs/api
