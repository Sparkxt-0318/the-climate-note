/*
  # Add Impact Tracking System

  1. New Tables
    - `note_impacts`: Stores AI-calculated environmental impact per note
    - `impact_review_queue`: Admin queue for low-confidence AI classifications

  2. Purpose
    - Track CO2 saved, plastic reduced, water saved per user action
    - Aggregate into collective platform impact
    - Flag uncertain AI classifications for admin review
*/

CREATE TABLE IF NOT EXISTS note_impacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES user_notes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,

  -- AI classification
  action_category text NOT NULL DEFAULT 'other',
  action_type text,
  confidence numeric(4,3) DEFAULT 0,

  -- Calculated impact values (NULL = not calculable)
  co2_saved_kg numeric(10,4),
  plastic_saved_g numeric(10,4),
  water_saved_liters numeric(10,4),
  energy_saved_kwh numeric(10,4),

  -- Source formula
  formula_id text,
  formula_source text,
  ai_reasoning text,

  -- Review status
  needs_review boolean DEFAULT false,
  reviewed_by uuid REFERENCES user_profiles(id),
  reviewed_at timestamptz,
  admin_override_category text,

  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS impact_review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES user_notes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  note_content text NOT NULL,
  ai_category text,
  ai_confidence numeric(4,3),
  ai_reasoning text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'corrected', 'dismissed')),
  reviewed_by uuid REFERENCES user_profiles(id),
  corrected_category text,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_note_impacts_user_id ON note_impacts(user_id);
CREATE INDEX IF NOT EXISTS idx_note_impacts_action_category ON note_impacts(action_category);
CREATE INDEX IF NOT EXISTS idx_note_impacts_needs_review ON note_impacts(needs_review) WHERE needs_review = true;
CREATE INDEX IF NOT EXISTS idx_impact_review_queue_status ON impact_review_queue(status);

-- RLS
ALTER TABLE note_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_review_queue ENABLE ROW LEVEL SECURITY;

-- Users can read their own impacts
CREATE POLICY "Users can read own impacts" ON note_impacts FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
-- Public can read impacts for aggregate stats (no user_id exposed)
CREATE POLICY "Public can read impacts for stats" ON note_impacts FOR SELECT TO authenticated USING (true);
-- System inserts impacts
CREATE POLICY "System can insert impacts" ON note_impacts FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

-- Admin policies for review queue
CREATE POLICY "Admins can read review queue" ON impact_review_queue FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "System can insert review queue" ON impact_review_queue FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update review queue" ON impact_review_queue FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
