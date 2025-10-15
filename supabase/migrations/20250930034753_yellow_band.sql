/*
  # Fix Groups-Profiles Foreign Key Relationship

  1. Drop existing foreign key constraint
  2. Add proper foreign key constraint with correct naming
  3. Refresh schema cache
  4. Update RLS policies to use correct relationship

  This fixes the "Could not find a relationship between 'groups' and 'profiles'" error.
*/

-- Drop existing foreign key if it exists
ALTER TABLE groups DROP CONSTRAINT IF EXISTS groups_creator_id_fkey;

-- Add the foreign key constraint with proper naming
ALTER TABLE groups 
ADD CONSTRAINT groups_creator_id_fkey 
FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Update RLS policies to ensure they work with the new relationship
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Creators can update own groups" ON groups;
DROP POLICY IF EXISTS "Anyone can read public groups" ON groups;
DROP POLICY IF EXISTS "Members can read private groups" ON groups;

-- Recreate RLS policies with proper relationships
CREATE POLICY "Users can create groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own groups"
  ON groups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can read public groups"
  ON groups
  FOR SELECT
  TO authenticated
  USING (NOT is_private);

CREATE POLICY "Members can read private groups"
  ON groups
  FOR SELECT
  TO authenticated
  USING (
    is_private AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

-- Ensure the groups table has proper indexes
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_is_private ON groups(is_private);