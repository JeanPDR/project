/*
  # Create users and tree pages tables

  1. New Tables
    - `users`
      - `id` (text, primary key)
      - `email` (text, unique)
      - `plan` (text, default 'free')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tree_pages`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key to users)
      - `title` (text)
      - `description` (text, optional)
      - `slug` (text, unique)
      - `theme` (jsonb)
      - `logo_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  plan text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tree_pages table
CREATE TABLE IF NOT EXISTS tree_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  theme jsonb DEFAULT '{"background": "#ffffff", "text": "#000000", "accent": "#0066ff"}'::jsonb,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for tree_pages table
CREATE POLICY "Users can create their own tree pages"
  ON tree_pages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own tree pages"
  ON tree_pages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tree pages"
  ON tree_pages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tree pages"
  ON tree_pages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_tree_pages_user_id ON tree_pages(user_id);
CREATE INDEX idx_tree_pages_slug ON tree_pages(slug);