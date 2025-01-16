/*
  # Add tracking and expiry fields to URLs table

  1. Changes
    - Add tracking_id column for anonymous URLs
    - Add expires_at column for URL expiration
    - Add unique constraint on tracking_id

  2. Security
    - No changes to RLS policies needed
*/

-- Add tracking_id column
ALTER TABLE urls ADD COLUMN tracking_id VARCHAR(12) UNIQUE;

-- Add expires_at column
ALTER TABLE urls ADD COLUMN expires_at TIMESTAMP;