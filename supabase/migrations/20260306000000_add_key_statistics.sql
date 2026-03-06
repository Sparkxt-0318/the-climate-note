-- Add key_statistics column to articles table
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS key_statistics text[];

-- Add comment
COMMENT ON COLUMN articles.key_statistics IS 'Array of key statistics and data points for the article';
