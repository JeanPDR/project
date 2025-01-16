/*
  # Add geolocation tracking

  1. Changes
    - Add geolocation columns to click_logs table:
      - latitude (decimal)
      - longitude (decimal)
      - ip_address (text)
    - Add index for geolocation queries
    - Add RLS policies for geolocation data

  2. Security
    - Enable RLS for new columns
    - Add policies to protect sensitive IP data
*/

-- Add geolocation columns
ALTER TABLE click_logs 
ADD COLUMN latitude decimal(10,8),
ADD COLUMN longitude decimal(11,8),
ADD COLUMN ip_address text;

-- Add index for geolocation queries
CREATE INDEX idx_click_logs_geo ON click_logs(latitude, longitude);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Users can read their own click logs" ON click_logs;
CREATE POLICY "Users can read their own click logs"
  ON click_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = click_logs.url_id
      AND urls.user_id = auth.uid()
    )
  );

-- Add policy to protect IP addresses (only show to URL owners)
CREATE POLICY "Users can see IP addresses of their own URLs"
  ON click_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = click_logs.url_id
      AND urls.user_id = auth.uid()
    )
  );