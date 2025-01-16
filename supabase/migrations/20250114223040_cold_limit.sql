/*
  # Add Tree Pages Support
  
  1. New Tables
    - tree_pages: Stores Linktree-style pages
      - id (uuid, primary key)
      - user_id (references users)
      - title (text)
      - description (text, optional)
      - slug (text, unique)
      - theme (jsonb for theme settings)
      - logo_url (text, optional)
      - created_at (timestamp)
      - updated_at (timestamp)
  
  2. Changes to URLs table
    - Add tree_page_id for links that belong to a tree page
    - Add title and description for tree page links
    - Add display_order for link ordering
  
  3. Security
    - Enable RLS on tree_pages
    - Add policies for CRUD operations
*/

-- Create tree_pages table
CREATE TABLE IF NOT EXISTS tree_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  theme jsonb NOT NULL DEFAULT '{"background": "#ffffff", "text": "#000000", "accent": "#0066ff"}',
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add tree page related columns to urls table
ALTER TABLE urls 
ADD COLUMN IF NOT EXISTS tree_page_id uuid REFERENCES tree_pages(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Enable RLS
ALTER TABLE tree_pages ENABLE ROW LEVEL SECURITY;

-- Policies for tree_pages
CREATE POLICY "Users can create their own tree pages"
  ON tree_pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tree pages"
  ON tree_pages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tree pages"
  ON tree_pages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tree pages"
  ON tree_pages FOR DELETE
  USING (auth.uid() = user_id);

-- Public can view published tree pages
CREATE POLICY "Public can view tree pages"
  ON tree_pages FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX idx_tree_pages_user_id ON tree_pages(user_id);
CREATE INDEX idx_tree_pages_slug ON tree_pages(slug);
CREATE INDEX idx_urls_tree_page_id ON urls(tree_page_id);