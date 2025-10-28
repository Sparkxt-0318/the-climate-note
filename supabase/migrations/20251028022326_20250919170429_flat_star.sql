/*
  # Create user notes table

  1. New Tables
    - `user_notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `article_id` (uuid, references articles)
      - `content` (text, the user's action note)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_notes` table
    - Add policy for users to manage their own notes
    - Add policy for public read access to all notes (for community notebook)

  3. Constraints
    - Unique constraint to prevent multiple notes per user per article
*/

CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Users can manage their own notes
CREATE POLICY "Users can manage own notes"
  ON user_notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public read access to all notes for community notebook
CREATE POLICY "Anyone can read notes"
  ON user_notes
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_notes_user_id_idx ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS user_notes_article_id_idx ON user_notes(article_id);
CREATE INDEX IF NOT EXISTS user_notes_created_at_idx ON user_notes(created_at DESC);