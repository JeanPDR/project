/*
  # Update short_url column type

  1. Changes
    - Modify short_url column to accept longer values
    - Keep unique constraint
*/

ALTER TABLE urls ALTER COLUMN short_url TYPE text;