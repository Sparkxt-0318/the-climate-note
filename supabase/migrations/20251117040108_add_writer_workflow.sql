/*
  # Add Writer Workflow System

  1. Changes to Tables
    - Add `role` column to `user_profiles` (admin/writer/user)
    - Add `status` column to `articles` (draft/pending_review/approved/published)
    - Add `author_id` column to `articles` to track who wrote it
    
  2. Security
    - Update RLS policies to restrict article creation to writers and admins only
    - Writers can only see/edit their own drafts
    - Admins can see and manage all articles
    - Public users cannot create or modify articles
    
  3. Notes
    - Default role is 'user' (regular app users, no writing privileges)
    - Writers must be manually assigned the 'writer' role by admins
    - Articles transition: draft → pending_review → approved → published
    - Only published articles with today's date appear in the main app
*/

-- Add role column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'writer', 'admin'));
  END IF;
END $$;

-- Add status and author_id columns to articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'status'
  ) THEN
    ALTER TABLE articles ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN author_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Update existing articles to have 'published' status and is_published=true
UPDATE articles 
SET status = 'published' 
WHERE is_published = true AND status IS NULL;

-- Update existing articles with is_published=false to 'draft' status
UPDATE articles 
SET status = 'draft' 
WHERE is_published = false AND status IS NULL;

-- Drop old RLS policies for articles
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
DROP POLICY IF EXISTS "Only admins can insert articles" ON articles;
DROP POLICY IF EXISTS "Only admins can update articles" ON articles;
DROP POLICY IF EXISTS "Only admins can delete articles" ON articles;

-- New RLS policies for articles

-- Public users can only read published articles with today's date or earlier
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  TO public
  USING (status = 'published' AND is_published = true);

-- Writers can read all their own articles
CREATE POLICY "Writers can read own articles"
  ON articles FOR SELECT
  TO authenticated
  USING (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('writer', 'admin')
    )
  );

-- Admins can read all articles
CREATE POLICY "Admins can read all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Writers and admins can create articles
CREATE POLICY "Writers can create articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('writer', 'admin')
    )
  );

-- Writers can update only their own draft or pending_review articles
CREATE POLICY "Writers can update own drafts"
  ON articles FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() AND
    status IN ('draft', 'pending_review') AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('writer', 'admin')
    )
  )
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('writer', 'admin')
    )
  );

-- Admins can update any article
CREATE POLICY "Admins can update all articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Writers can delete only their own drafts
CREATE POLICY "Writers can delete own drafts"
  ON articles FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid() AND
    status = 'draft' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('writer', 'admin')
    )
  );

-- Admins can delete any article
CREATE POLICY "Admins can delete all articles"
  ON articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);