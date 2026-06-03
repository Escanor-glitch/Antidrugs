# Supabase Integration - Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: volunteer-management
   - Database Password: (save this securely)
   - Region: Choose closest to you
5. Wait for project initialization (2-3 minutes)

## Step 2: Get Your Credentials

1. After project is created, go to **Project Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)
3. Save these securely

## Step 3: Add Environment Variables

Create or update `.env` file in project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create Database Tables

The database schema has been created with the following tables:

### Tables Created:
- `users` - Application users with roles
- `volunteers` - Volunteer information
- `sectors` - Volunteer sectors/departments
- `neighborhoods` - Geographic neighborhoods
- `events` - Events and activities
- `attendance` - QR-based attendance records
- `volunteer_follow_up_files` - Volunteer assessments

### Security:
- Row Level Security (RLS) enabled on all tables
- Role-based access control policies
- Authentication required for all operations

## Step 5: Test Connection

Run the application:

```bash
npm install
npm run dev
```

## Features Available

### Authentication
- Email/password sign up
- Email/password sign in
- Password reset
- User profile management

### Volunteer Management
- Create volunteer
- Edit volunteer information
- Delete volunteer
- View volunteer profiles
- Track volunteer hours
- Generate QR codes

### Event Management
- Create events
- Edit event details
- Delete events
- Update event status
- Track event attendance

### Attendance Tracking
- QR code scanning (via manual entry in MVP)
- Manual attendance entry
- Attendance status tracking (present/absent/excused)
- Attendance reports

### Organization Management
- Sector management
- Neighborhood coordination
- Manager/coordinator assignment

### Follow-up Profiles
- Volunteer assessments
- Participation tracking
- Commitment evaluation
- Leadership potential identification
- Personalized recommendations

## API Services Available

### Volunteers
```typescript
import { 
  fetchVolunteers, 
  fetchVolunteerById, 
  createVolunteer, 
  updateVolunteer, 
  deleteVolunteer 
} from '@/services/api/volunteers';
```

### Events
```typescript
import { 
  fetchEvents, 
  fetchEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '@/services/api/events';
```

### Attendance
```typescript
import { 
  recordAttendance, 
  fetchAttendance, 
  updateAttendance 
} from '@/services/api/attendance';
```

### Sectors & Neighborhoods
```typescript
import { 
  fetchSectors, 
  fetchNeighborhoods, 
  createSector, 
  createNeighborhood 
} from '@/services/api/sectors';
```

### Authentication
```typescript
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser 
} from '@/services/api/auth';
```

## Troubleshooting

### "Missing Supabase environment variables"
- Check .env file has correct variables
- Restart development server after adding .env
- Variables should start with `VITE_` for Vite to expose them

### "Authentication failed"
- Verify email and password are correct
- Check user exists in Supabase
- Ensure Supabase project is running

### "Permission denied" errors
- Check RLS policies are correct
- Verify user has appropriate role
- Check authentication is working

### Connection errors
- Verify Supabase URL is correct
- Check API key is valid and not expired
- Ensure project hasn't been paused

## Database Backups

Supabase automatically backs up your database daily. To restore:

1. Go to Project Settings → Backups
2. Select backup date
3. Click "Restore"

## Performance Tips

1. Use pagination for large datasets (already implemented)
2. Add indexes for frequently queried fields (already done)
3. Enable row level security for data protection (already done)
4. Use real-time subscriptions for live updates (available in components)

## Support

- Supabase Documentation: https://supabase.com/docs
- Contact Support: https://supabase.com/support
- GitHub Issues: https://github.com/supabase/supabase/issues

## Next Steps

1. Deploy application to production
2. Set up authentication emails in Supabase
3. Configure email templates
4. Set up custom domain (if needed)
5. Enable analytics and monitoring
