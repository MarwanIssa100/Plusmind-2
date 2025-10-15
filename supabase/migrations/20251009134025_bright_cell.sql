/*
  # Add location column to therapist_profiles table

  1. New Columns
    - `location` (text) - Practice location for therapists
  
  2. Changes
    - Add location column to therapist_profiles table with conditional check
    - Column allows null values for optional location information
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'therapist_profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE therapist_profiles ADD COLUMN location text;
  END IF;
END $$;