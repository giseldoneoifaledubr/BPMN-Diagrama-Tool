/*
  # Create diagrams table

  1. New Tables
    - `diagrams`
      - `id` (uuid, primary key) - Unique diagram identifier
      - `user_id` (uuid, foreign key) - References user_profiles
      - `name` (text) - Diagram name
      - `elements` (jsonb) - BPMN elements data
      - `connections` (jsonb) - BPMN connections data
      - `pools` (jsonb) - BPMN pools data
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `diagrams` table
    - Add policies for users to manage their own diagrams

  3. Indexes
    - Add indexes for better query performance
*/

-- Create diagrams table
CREATE TABLE IF NOT EXISTS diagrams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name text NOT NULL DEFAULT 'Novo Diagrama',
    elements jsonb DEFAULT '[]'::jsonb,
    connections jsonb DEFAULT '[]'::jsonb,
    pools jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "users_select_own_diagrams"
    ON diagrams
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_diagrams"
    ON diagrams
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_update_own_diagrams"
    ON diagrams
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "users_delete_own_diagrams"
    ON diagrams
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_diagrams_updated_at
    BEFORE UPDATE ON diagrams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_updated_at ON diagrams(updated_at DESC);