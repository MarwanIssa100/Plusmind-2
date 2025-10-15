/*
  # Add avatar_url column to therapist_profiles

  1. Changes
    - Add `avatar_url` column to `therapist_profiles` table
    - Column is nullable TEXT type to store profile image URLs
    - Allows therapists to upload and display their professional photos

  2. Security
    - No RLS changes needed as existing policies cover new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'therapist_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE therapist_profiles ADD COLUMN avatar_url text;
  END IF;
END $$;