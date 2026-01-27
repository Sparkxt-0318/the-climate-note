/*
  # Add Article Scheduling System

  1. Changes to Tables
    - Add `scheduled_publish_date` column to `articles` (date article should auto-publish)
    - Add `auto_publish` column to `articles` (boolean to enable/disable auto-publishing)
    - Add `scheduled_at` column to track when article was scheduled

  2. Purpose
    - Allow admins to schedule articles for future publication
    - Enable automatic publishing via Edge Function
    - Articles auto-publish at midnight CST on scheduled_publish_date

  3. Notes
    - scheduled_publish_date = date article should go live
    - auto_publish = true means article will auto-publish on scheduled date
    - auto_publish = false means admin must manually publish (existing behavior)
    - Edge Function will check daily for articles where:
      * scheduled_publish_date = today
      * auto_publish = true
      * is_published = false
      * status = 'approved'
*/

-- Add scheduled_publish_date column to articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'scheduled_publish_date'
  ) THEN
    ALTER TABLE articles ADD COLUMN scheduled_publish_date date;
  END IF;
END $$;

-- Add auto_publish column to articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'auto_publish'
  ) THEN
    ALTER TABLE articles ADD COLUMN auto_publish boolean DEFAULT false;
  END IF;
END $$;

-- Add scheduled_at timestamp column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'scheduled_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN scheduled_at timestamptz;
  END IF;
END $$;

-- Update existing published articles to have scheduled_publish_date = published_date
UPDATE articles
SET scheduled_publish_date = published_date::date
WHERE is_published = true
  AND status = 'published'
  AND scheduled_publish_date IS NULL;

-- Create index for faster scheduled article lookups
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish_date
  ON articles(scheduled_publish_date)
  WHERE auto_publish = true AND is_published = false;

-- Create index for auto-publish queries
CREATE INDEX IF NOT EXISTS idx_articles_auto_publish
  ON articles(auto_publish, scheduled_publish_date, is_published, status);

-- Add comment to table
COMMENT ON COLUMN articles.scheduled_publish_date IS 'Date when article should auto-publish (CST timezone)';
COMMENT ON COLUMN articles.auto_publish IS 'If true, article will auto-publish on scheduled_publish_date via Edge Function';
COMMENT ON COLUMN articles.scheduled_at IS 'Timestamp when article was scheduled by admin';
