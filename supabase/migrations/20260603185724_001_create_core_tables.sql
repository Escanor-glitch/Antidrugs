/*
  # Create Core Tables for Volunteer Management System

  1. New Tables
    - `users` - Application users with roles
    - `sectors` - Volunteer sectors
    - `neighborhoods` - Geographic neighborhoods
    - `volunteers` - Volunteer information linked to users
    - `events` - Events that volunteers attend
    - `attendance` - QR-based attendance records
    - `volunteer_follow_up_files` - Volunteer assessments and follow-ups

  2. Security
    - Enable RLS on all tables
    - Create policies for role-based access
    - Authenticated users only

  3. Indexes
    - Add indexes for common queries
    - Foreign key indexes for performance
*/

-- Create enums for status types
CREATE TYPE user_role AS ENUM (
  'governorate_supervisor',
  'unit_director',
  'evaluation_committee',
  'sector_manager',
  'neighborhood_coordinator',
  'volunteer'
);

CREATE TYPE volunteer_status AS ENUM ('active', 'inactive', 'pending');

CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'excused');

CREATE TYPE participation_level AS ENUM (
  'مشارك بفاعلية',
  'مشارك بانتظام',
  'مشارك أحياناً',
  'يحتاج زيادة المشاركة'
);

CREATE TYPE commitment_level AS ENUM (
  'ملتزم جداً',
  'ملتزم',
  'يحتاج تحسين الالتزام'
);

CREATE TYPE teammate_status AS ENUM (
  'متعاون جداً',
  'متعاون',
  'يحتاج تطوير مهارات العمل الجماعي'
);

CREATE TYPE communication_skill AS ENUM (
  'ممتازة',
  'جيدة',
  'تحتاج تطوير'
);

CREATE TYPE leadership_potential AS ENUM (
  'مرشح للقيادة',
  'يظهر إمكانيات جيدة',
  'يحتاج مزيداً من الخبرة'
);

CREATE TYPE recommendation AS ENUM (
  'مرشح للتكريم',
  'مرشح لمنصب منسق حي',
  'مرشح لمنصب رئيس قطاع',
  'مرشح لقيادة فعالية',
  'يحتاج متابعة',
  'يحتاج تدريب إضافي',
  'لا توصية'
);

-- Create users table (relies on Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'volunteer',
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director')
    )
  );

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sectors are visible to authenticated users"
  ON sectors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only managers can create sectors"
  ON sectors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
  );

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  coordinator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(name, sector_id)
);

ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Neighborhoods are visible to authenticated users"
  ON neighborhoods FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coordinators can create neighborhoods"
  ON neighborhoods FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager', 'neighborhood_coordinator')
    )
  );

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  status volunteer_status NOT NULL DEFAULT 'pending',
  qr_code TEXT UNIQUE,
  hours_volunteered INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view their own profile"
  ON volunteers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Coordinators can view sector volunteers"
  ON volunteers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
    OR
    EXISTS (
      SELECT 1 FROM neighborhoods n
      WHERE n.id = volunteers.neighborhood_id AND n.coordinator_id = auth.uid()
    )
  );

CREATE POLICY "Managers can create volunteers"
  ON volunteers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager', 'neighborhood_coordinator')
    )
  );

CREATE POLICY "Managers can update volunteers"
  ON volunteers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
    OR
    EXISTS (
      SELECT 1 FROM neighborhoods n
      WHERE n.id = volunteers.neighborhood_id AND n.coordinator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
    OR
    EXISTS (
      SELECT 1 FROM neighborhoods n
      WHERE n.id = volunteers.neighborhood_id AND n.coordinator_id = auth.uid()
    )
  );

CREATE POLICY "Managers can delete volunteers"
  ON volunteers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
  );

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  status event_status NOT NULL DEFAULT 'upcoming',
  volunteers_registered INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are visible to authenticated users"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coordinators can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager', 'neighborhood_coordinator')
    )
  );

CREATE POLICY "Coordinators can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM neighborhoods n
      WHERE n.id = events.neighborhood_id AND n.coordinator_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM neighborhoods n
      WHERE n.id = events.neighborhood_id AND n.coordinator_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'sector_manager')
    )
  );

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status attendance_status NOT NULL DEFAULT 'present',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scanned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(volunteer_id, event_id)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coordinators can view attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'evaluation_committee')
    )
    OR
    EXISTS (
      SELECT 1 FROM volunteers v
      JOIN neighborhoods n ON n.id = v.neighborhood_id
      WHERE v.id = attendance.volunteer_id AND n.coordinator_id = auth.uid()
    )
  );

CREATE POLICY "Coordinators can record attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'neighborhood_coordinator')
    )
  );

CREATE POLICY "Coordinators can update attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'neighborhood_coordinator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'neighborhood_coordinator')
    )
  );

-- Create volunteer follow-up files table
CREATE TABLE IF NOT EXISTS volunteer_follow_up_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  participation_level participation_level,
  commitment_level commitment_level,
  teammate_collaboration teammate_status,
  communication_skill communication_skill,
  leadership_potential leadership_potential,
  recommendation recommendation,
  notes TEXT,
  assessed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assessment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE volunteer_follow_up_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view their follow-up files"
  ON volunteer_follow_up_files FOR SELECT
  TO authenticated
  USING (
    volunteer_id IN (
      SELECT id FROM volunteers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Evaluation committee can view all follow-ups"
  ON volunteer_follow_up_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'evaluation_committee')
    )
  );

CREATE POLICY "Evaluation committee can create follow-ups"
  ON volunteer_follow_up_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'evaluation_committee', 'sector_manager')
    )
  );

CREATE POLICY "Evaluation committee can update follow-ups"
  ON volunteer_follow_up_files FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'evaluation_committee', 'sector_manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('governorate_supervisor', 'unit_director', 'evaluation_committee', 'sector_manager')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_volunteers_sector_id ON volunteers(sector_id);
CREATE INDEX idx_volunteers_neighborhood_id ON volunteers(neighborhood_id);
CREATE INDEX idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX idx_events_sector_id ON events(sector_id);
CREATE INDEX idx_events_neighborhood_id ON events(neighborhood_id);
CREATE INDEX idx_attendance_volunteer_id ON attendance(volunteer_id);
CREATE INDEX idx_attendance_event_id ON attendance(event_id);
CREATE INDEX idx_neighborhoods_sector_id ON neighborhoods(sector_id);
CREATE INDEX idx_follow_up_volunteer_id ON volunteer_follow_up_files(volunteer_id);