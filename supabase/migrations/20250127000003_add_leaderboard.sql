/*
  # Add Leaderboard System

  1. Changes to user_profiles
    - Add `display_name` column (user-chosen public name)
    - Add `avatar_url` column (profile photo, for future OAuth avatars)

  2. New Tables
    - `featured_notes` - admin-curated notes highlighted on the daily leaderboard
      - note_id: references user_notes
      - user_id: references user_profiles
      - featured_date: the date this note is featured (CST)
      - admin_message: optional highlight message from admin

  3. Security
    - Anyone can read featured notes (public leaderboard)
    - Only admins can create/update/delete featured notes
*/

-- Add display_name and avatar_url to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create featured_notes table
CREATE TABLE IF NOT EXISTS featured_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES user_notes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  featured_date date NOT NULL DEFAULT CURRENT_DATE,
  admin_message text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(note_id, featured_date)
);

ALTER TABLE featured_notes ENABLE ROW LEVEL SECURITY;

-- Anyone can read featured notes
CREATE POLICY "Anyone can read featured notes"
  ON featured_notes FOR SELECT
  TO public
  USING (true);

-- Only admins can manage featured notes
CREATE POLICY "Admins can manage featured notes"
  ON featured_notes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_featured_notes_date ON featured_notes(featured_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name);
