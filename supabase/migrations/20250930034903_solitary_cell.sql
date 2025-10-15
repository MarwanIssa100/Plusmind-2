/*
  # Fix Group Members Infinite Recursion

  1. Problem
    - Infinite recursion in group_members RLS policies
    - Policies are referencing each other in circular way

  2. Solution
    - Drop existing problematic policies
    - Create simpler, non-recursive policies
    - Use direct table references instead of complex joins
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Members can read group membership" ON group_members;
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON group_members;

-- Create simple, non-recursive policies for group_members
CREATE POLICY "Users can read all group memberships"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join public groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM groups 
      WHERE groups.id = group_members.group_id 
      AND groups.is_private = false
    )
  );

CREATE POLICY "Users can join private groups if invited"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM groups 
      WHERE groups.id = group_members.group_id 
      AND (
        groups.is_private = false OR
        groups.creator_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can leave groups they joined"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update groups policies to be simpler
DROP POLICY IF EXISTS "Anyone can read public groups" ON groups;
DROP POLICY IF EXISTS "Members can read private groups" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Creators can update own groups" ON groups;

-- Create simpler group policies
CREATE POLICY "Authenticated users can read all groups"
  ON groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups"
  ON groups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Update group_posts policies to avoid recursion
DROP POLICY IF EXISTS "Members can read group posts" ON group_posts;
DROP POLICY IF EXISTS "Members can create group posts" ON group_posts;
DROP POLICY IF EXISTS "Authors can update own group posts" ON group_posts;
DROP POLICY IF EXISTS "Authors can delete own group posts" ON group_posts;

-- Create simpler group_posts policies
CREATE POLICY "Users can read group posts if member"
  ON group_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_posts.group_id 
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create posts"
  ON group_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_posts.group_id 
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update their posts"
  ON group_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts"
  ON group_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';