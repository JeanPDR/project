/*
  # Add click tracking functionality

  1. New Tables
    - `click_logs`
      - `id` (uuid, primary key)
      - `url_id` (uuid, references urls)
      - `country` (text, nullable)
      - `region` (text, nullable)
      - `city` (text, nullable)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on `click_logs` table
    - Add policies for authenticated and anonymous users
*/

-- Create click_logs table
CREATE TABLE IF NOT EXISTS click_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id uuid NOT NULL,
  country text,
  region text,
  city text,
  timestamp timestamptz DEFAULT now(),

  CONSTRAINT fk_url
    FOREIGN KEY (url_id)
    REFERENCES urls(id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;

-- Add policies
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

CREATE POLICY "Anonymous users can read click logs for their tracked URLs"
  ON click_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = click_logs.url_id
      AND urls.tracking_id IS NOT NULL
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_click_logs_url_id ON click_logs(url_id);
CREATE INDEX idx_click_logs_timestamp ON click_logs(timestamp DESC);