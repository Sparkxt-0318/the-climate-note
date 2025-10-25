/*
  # Create articles table for The Climate Note

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `subtitle` (text, optional)
      - `content` (text, required - HTML content)
      - `category` (text, optional - for grouping articles)
      - `published_date` (date, required)
      - `reading_time` (integer, estimated reading time in minutes)
      - `is_published` (boolean, default false)
      - `key_takeaways` (text array, for sticky note summaries)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access to published articles
    - Add policy for authenticated admin users to manage articles
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  content text NOT NULL,
  category text,
  published_date date NOT NULL,
  reading_time integer DEFAULT 5,
  is_published boolean DEFAULT false,
  key_takeaways text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Anyone can read published articles"
  ON articles
  FOR SELECT
  TO public
  USING (is_published = true);

-- Allow authenticated users to manage articles (for admin functionality)
CREATE POLICY "Authenticated users can manage articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS articles_published_date_idx ON articles(published_date DESC);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS articles_is_published_idx ON articles(is_published);