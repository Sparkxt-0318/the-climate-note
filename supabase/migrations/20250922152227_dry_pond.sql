/*
  # Add note reactions system

  1. New Tables
    - `note_reactions`
      - `id` (uuid, primary key)
      - `note_id` (uuid, foreign key to user_notes)
      - `user_id` (uuid, foreign key to user_profiles)
      - `reaction_type` (text, default 'encourage')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `note_reactions` table
    - Add policies for authenticated users to manage their own reactions
    - Add policy for anyone to read reactions

  3. Indexes
    - Add index on note_id for efficient querying
    - Add unique constraint on user_id + note_id to prevent duplicate reactions
*/

CREATE TABLE IF NOT EXISTS note_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES user_notes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  reaction_type text DEFAULT 'encourage',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, note_id)
);

ALTER TABLE note_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions"
  ON note_reactions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage own reactions"
  ON note_reactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS note_reactions_note_id_idx ON note_reactions(note_id);
CREATE INDEX IF NOT EXISTS note_reactions_user_id_idx ON note_reactions(user_id);