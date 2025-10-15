/*
  # Initial Schema Setup for MindCare Connect

  1. New Tables
    - `profiles` - Extended user profile information
    - `blog_posts` - Community blog posts
    - `private_notes` - Encrypted private notes for patients
    - `therapist_profiles` - Additional therapist information
    - `groups` - Support groups
    - `group_members` - Group membership tracking
    - `group_posts` - Posts within groups
    - `appointments` - Scheduled appointments between patients and therapists

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user type
    - Ensure patients can only access their own private data
    - Allow public access to blog posts and therapist profiles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  user_type text NOT NULL CHECK (user_type IN ('patient', 'therapist')),
  date_of_birth date,
  primary_concern text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create therapist_profiles table
CREATE TABLE IF NOT EXISTS therapist_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  specializations text[] DEFAULT '{}',
  license_number text,
  years_experience integer DEFAULT 0,
  bio text,
  hourly_rate decimal(10,2) DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  availability_slots jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create private_notes table
CREATE TABLE IF NOT EXISTS private_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  encrypted_content text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_private boolean DEFAULT false,
  member_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group_posts table
CREATE TABLE IF NOT EXISTS group_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date timestamptz NOT NULL,
  appointment_time text NOT NULL,
  type text DEFAULT 'video' CHECK (type IN ('video', 'phone', 'in-person')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Therapist profiles policies
CREATE POLICY "Anyone can read therapist profiles"
  ON therapist_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Therapists can update own profile"
  ON therapist_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Therapists can insert own profile"
  ON therapist_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Blog posts policies
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Authors can read own blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Private notes policies (patients only)
CREATE POLICY "Patients can manage own private notes"
  ON private_notes FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Groups policies
CREATE POLICY "Anyone can read public groups"
  ON groups FOR SELECT
  TO authenticated
  USING (NOT is_private);

CREATE POLICY "Members can read private groups"
  ON groups FOR SELECT
  TO authenticated
  USING (
    is_private AND EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own groups"
  ON groups FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Group members policies
CREATE POLICY "Members can read group membership"
  ON group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups 
      WHERE id = group_id AND (NOT is_private OR EXISTS (
        SELECT 1 FROM group_members gm 
        WHERE gm.group_id = groups.id AND gm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Group posts policies
CREATE POLICY "Members can read group posts"
  ON group_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_posts.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create group posts"
  ON group_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_posts.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own group posts"
  ON group_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own group posts"
  ON group_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Appointments policies
CREATE POLICY "Patients can read own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Therapists can read their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = therapist_id);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Participants can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapist_profiles_updated_at BEFORE UPDATE ON therapist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_private_notes_updated_at BEFORE UPDATE ON private_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_posts_updated_at BEFORE UPDATE ON group_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Add trigger for group member count
CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();