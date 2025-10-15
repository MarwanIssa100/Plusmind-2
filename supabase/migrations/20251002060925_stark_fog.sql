/*
  # Fix Foreign Key Relationships for Appointments and Therapist Profiles

  1. Foreign Key Fixes
    - Add foreign keys between appointments and profiles tables
    - Add foreign keys between therapist_profiles and profiles tables
    - Use proper constraint names that match Supabase queries

  2. Schema Cache Refresh
    - Notify Supabase to reload schema cache
    - Ensure relationships are recognized immediately

  3. Security
    - Recreate RLS policies with proper relationships
    - Add indexes for better performance
*/

-- Drop existing foreign keys if they exist (to avoid conflicts)
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_therapist_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS fk_patient;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS fk_therapist;

ALTER TABLE therapist_profiles DROP CONSTRAINT IF EXISTS therapist_profiles_user_id_fkey;
ALTER TABLE therapist_profiles DROP CONSTRAINT IF EXISTS therapist_profiles_profile_id_fkey;

-- Add proper foreign key constraints for appointments table
ALTER TABLE appointments 
ADD CONSTRAINT appointments_patient_id_fkey 
FOREIGN KEY (patient_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE appointments 
ADD CONSTRAINT appointments_therapist_id_fkey 
FOREIGN KEY (therapist_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add proper foreign key constraints for therapist_profiles table
ALTER TABLE therapist_profiles 
ADD CONSTRAINT therapist_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE therapist_profiles 
ADD CONSTRAINT therapist_profiles_profile_id_fkey 
FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_user_id ON therapist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_profile_id ON therapist_profiles(profile_id);

-- Recreate RLS policies for appointments
DROP POLICY IF EXISTS "Patients can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Therapists can read their appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;
DROP POLICY IF EXISTS "Participants can update appointments" ON appointments;

CREATE POLICY "Patients can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Therapists can read their appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = therapist_id);

CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Participants can update appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- Recreate RLS policies for therapist_profiles
DROP POLICY IF EXISTS "Anyone can read therapist profiles" ON therapist_profiles;
DROP POLICY IF EXISTS "Therapists can insert own profile" ON therapist_profiles;
DROP POLICY IF EXISTS "Therapists can update own profile" ON therapist_profiles;

CREATE POLICY "Anyone can read therapist profiles"
  ON therapist_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Therapists can insert own profile"
  ON therapist_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Therapists can update own profile"
  ON therapist_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';