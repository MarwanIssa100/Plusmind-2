/*
  # Add HMS Room Support to Appointments

  1. Changes
    - Add hms_room_id column to appointments table
    - Add hms_room_code column for backup room identification
    - Add session_started_at and session_ended_at timestamps
    - Add session_duration for tracking actual session time

  2. Security
    - Maintain existing RLS policies
    - Add indexes for better performance
*/

-- Add HMS room support columns to appointments
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS hms_room_id text,
ADD COLUMN IF NOT EXISTS hms_room_code text,
ADD COLUMN IF NOT EXISTS session_started_at timestamptz,
ADD COLUMN IF NOT EXISTS session_ended_at timestamptz,
ADD COLUMN IF NOT EXISTS session_duration integer DEFAULT 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_hms_room_id ON appointments(hms_room_id);
CREATE INDEX IF NOT EXISTS idx_appointments_session_dates ON appointments(session_started_at, session_ended_at);

-- Add function to calculate session duration
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_ended_at IS NOT NULL AND NEW.session_started_at IS NOT NULL THEN
    NEW.session_duration = EXTRACT(EPOCH FROM (NEW.session_ended_at - NEW.session_started_at))::integer;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically calculate session duration
DROP TRIGGER IF EXISTS calculate_session_duration_trigger ON appointments;
CREATE TRIGGER calculate_session_duration_trigger
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_session_duration();

-- Add comment for documentation
COMMENT ON COLUMN appointments.hms_room_id IS 'HMS room ID for video sessions';
COMMENT ON COLUMN appointments.hms_room_code IS 'HMS room code for backup identification';
COMMENT ON COLUMN appointments.session_started_at IS 'Timestamp when video session actually started';
COMMENT ON COLUMN appointments.session_ended_at IS 'Timestamp when video session ended';
COMMENT ON COLUMN appointments.session_duration IS 'Actual session duration in seconds';