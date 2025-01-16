/*
  # Update short_url column

  1. Changes
    - Remove length restriction from short_url column
    - Keep unique constraint
    - Keep existing data

  2. Security
    - Maintain existing RLS policies
*/

-- Modify short_url column to accept any length
ALTER TABLE urls ALTER COLUMN short_url TYPE text;