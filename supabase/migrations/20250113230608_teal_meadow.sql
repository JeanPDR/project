-- Modify short_url column to accept any length
ALTER TABLE urls ALTER COLUMN short_url TYPE text;