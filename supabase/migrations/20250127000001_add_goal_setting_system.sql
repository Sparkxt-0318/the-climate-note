/*
  # Add Goal Setting System

  1. New Tables
    - `user_goals`: Stores user environmental goals
    - `goal_milestones`: Tracks progress milestones for goals
    - `goal_decision_queue`: Manages 48-hour grace period for expired goals

  2. Purpose
    - Allow users to set personalized environmental goals
    - Track progress towards goal completion
    - Public/private goal visibility
    - Grace period system for goal expiration

  3. Features
    - Customizable goals with templates
    - Multiple goal types (streak, action count, category-specific, custom)
    - Progress tracking with milestones
    - 48-hour decision window when goals expire
    - Connection to user notes for automatic progress tracking
*/

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,

  -- Goal details
  title text NOT NULL,
  description text,
  goal_type text NOT NULL CHECK (goal_type IN ('streak', 'action_count', 'category_specific', 'custom')),

  -- Target and progress
  target_value integer NOT NULL, -- e.g., 30 days, 50 actions
  current_progress integer DEFAULT 0,

  -- Dates
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  completed_at timestamptz,

  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused', 'pending_decision')),

  -- Visibility
  is_public boolean DEFAULT false,

  -- Category for category-specific goals
  category text,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_progress CHECK (current_progress >= 0 AND current_progress <= target_value)
);

-- Create goal_milestones table
CREATE TABLE IF NOT EXISTS goal_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES user_goals(id) ON DELETE CASCADE NOT NULL,

  -- Milestone details
  milestone_value integer NOT NULL, -- e.g., 10 days, 25 actions
  milestone_name text, -- e.g., "Quarter complete", "Halfway there"

  -- Achievement
  reached_at timestamptz,
  celebration_shown boolean DEFAULT false,

  created_at timestamptz DEFAULT now()
);

-- Create goal_decision_queue table (for 48-hour grace period)
CREATE TABLE IF NOT EXISTS goal_decision_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES user_goals(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,

  -- Grace period tracking
  expired_at timestamptz NOT NULL, -- When goal originally expired
  decision_deadline timestamptz NOT NULL, -- expired_at + 48 hours
  notified_at timestamptz, -- When user was notified

  -- User decision
  decision text CHECK (decision IN ('mark_complete', 'extend', 'retry', 'archive')),
  decision_made_at timestamptz,

  created_at timestamptz DEFAULT now()
);

-- Create goal_templates table (pre-defined goal suggestions)
CREATE TABLE IF NOT EXISTS goal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  goal_type text NOT NULL CHECK (goal_type IN ('streak', 'action_count', 'category_specific', 'custom')),
  suggested_target integer,
  suggested_duration_days integer,
  category text,
  icon text, -- emoji or icon name
  popularity_score integer DEFAULT 0, -- track which templates are used most
  created_at timestamptz DEFAULT now()
);

-- Insert default goal templates
INSERT INTO goal_templates (title, description, goal_type, suggested_target, suggested_duration_days, category, icon) VALUES
  ('30-Day Note Streak', 'Write a climate action note every day for 30 days', 'streak', 30, 30, NULL, '🔥'),
  ('Plastic-Free Challenge', 'Avoid single-use plastics for 7 days', 'category_specific', 7, 7, 'waste', '♻️'),
  ('Sustainable Transport Week', 'Use eco-friendly transportation for 7 days', 'category_specific', 7, 7, 'transportation', '🚴'),
  ('50 Actions Goal', 'Commit to 50 environmental actions', 'action_count', 50, 90, NULL, '🎯'),
  ('Weekly Climate Champion', 'Write 7 notes in a week', 'action_count', 7, 7, NULL, '🌍'),
  ('Plant-Based Month', 'Focus on plant-based meals for 30 days', 'category_specific', 30, 30, 'food', '🌱'),
  ('Energy Saver Week', 'Take energy-saving actions for 7 days', 'category_specific', 7, 7, 'energy', '💡'),
  ('Water Conservation', 'Reduce water usage for 14 days', 'category_specific', 14, 14, 'water', '💧');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(status);
CREATE INDEX IF NOT EXISTS idx_user_goals_end_date ON user_goals(end_date);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_decision_queue_user_id ON goal_decision_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_decision_queue_decision_deadline ON goal_decision_queue(decision_deadline);

-- Row Level Security (RLS)
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_decision_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_goals

-- Users can read their own goals
CREATE POLICY "Users can read own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can read public goals of others
CREATE POLICY "Users can read public goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Users can create their own goals
CREATE POLICY "Users can create own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own goals
CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own goals
CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for goal_milestones

-- Users can read milestones for their own goals or public goals
CREATE POLICY "Users can read goal milestones"
  ON goal_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_goals
      WHERE user_goals.id = goal_milestones.goal_id
      AND (user_goals.user_id = auth.uid() OR user_goals.is_public = true)
    )
  );

-- System can create milestones (via trigger or function)
CREATE POLICY "System can create milestones"
  ON goal_milestones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_goals
      WHERE user_goals.id = goal_milestones.goal_id
      AND user_goals.user_id = auth.uid()
    )
  );

-- RLS Policies for goal_decision_queue

-- Users can only see their own decision queue items
CREATE POLICY "Users can read own decision queue"
  ON goal_decision_queue FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert into decision queue
CREATE POLICY "System can create decision queue items"
  ON goal_decision_queue FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own decision queue items
CREATE POLICY "Users can update own decision queue"
  ON goal_decision_queue FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for goal_templates

-- Everyone can read goal templates
CREATE POLICY "Anyone can read goal templates"
  ON goal_templates FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically update goal progress based on notes
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update streak goals
  UPDATE user_goals
  SET
    current_progress = (
      SELECT COUNT(DISTINCT DATE(created_at))
      FROM user_notes
      WHERE user_id = NEW.user_id
        AND created_at >= user_goals.start_date
        AND created_at <= user_goals.end_date
    ),
    updated_at = now()
  WHERE user_id = NEW.user_id
    AND goal_type = 'streak'
    AND status = 'active';

  -- Update action_count goals
  UPDATE user_goals
  SET
    current_progress = (
      SELECT COUNT(*)
      FROM user_notes
      WHERE user_id = NEW.user_id
        AND created_at >= user_goals.start_date
        AND created_at <= user_goals.end_date
    ),
    updated_at = now()
  WHERE user_id = NEW.user_id
    AND goal_type = 'action_count'
    AND status = 'active';

  -- Check if any goals are completed
  UPDATE user_goals
  SET
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  WHERE user_id = NEW.user_id
    AND status = 'active'
    AND current_progress >= target_value
    AND completed_at IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update goal progress when notes are created
DROP TRIGGER IF EXISTS trigger_update_goal_progress ON user_notes;
CREATE TRIGGER trigger_update_goal_progress
  AFTER INSERT ON user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress();

-- Function to check for expired goals and move to decision queue
CREATE OR REPLACE FUNCTION check_expired_goals()
RETURNS void AS $$
BEGIN
  -- Move expired active goals to pending_decision status
  UPDATE user_goals
  SET status = 'pending_decision'
  WHERE status = 'active'
    AND end_date < CURRENT_DATE
    AND current_progress < target_value;

  -- Insert into decision queue (only if not already there)
  INSERT INTO goal_decision_queue (goal_id, user_id, expired_at, decision_deadline)
  SELECT
    g.id,
    g.user_id,
    now(),
    now() + INTERVAL '48 hours'
  FROM user_goals g
  WHERE g.status = 'pending_decision'
    AND NOT EXISTS (
      SELECT 1 FROM goal_decision_queue q
      WHERE q.goal_id = g.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-archive goals past decision deadline
CREATE OR REPLACE FUNCTION auto_archive_undecided_goals()
RETURNS void AS $$
BEGIN
  -- Archive goals that passed decision deadline without user input
  UPDATE user_goals
  SET
    status = 'failed',
    updated_at = now()
  WHERE id IN (
    SELECT goal_id
    FROM goal_decision_queue
    WHERE decision_deadline < now()
      AND decision IS NULL
  );

  -- Mark decision queue items as auto-archived
  UPDATE goal_decision_queue
  SET
    decision = 'archive',
    decision_made_at = now()
  WHERE decision_deadline < now()
    AND decision IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at trigger for user_goals
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_goals_updated_at ON user_goals;
CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE user_goals IS 'User environmental goals with progress tracking';
COMMENT ON TABLE goal_milestones IS 'Milestone achievements for goals';
COMMENT ON TABLE goal_decision_queue IS '48-hour grace period for expired goals';
COMMENT ON TABLE goal_templates IS 'Pre-defined goal templates for users to choose from';
COMMENT ON COLUMN user_goals.goal_type IS 'Type of goal: streak (consecutive days), action_count (total actions), category_specific (focused on one category), custom (user-defined)';
COMMENT ON COLUMN user_goals.is_public IS 'Whether goal is visible to other users or private';
COMMENT ON COLUMN user_goals.status IS 'active: currently pursuing, completed: achieved target, failed: expired without completion, paused: temporarily stopped, pending_decision: in 48h grace period';
