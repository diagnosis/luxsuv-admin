/*
  # Create Booking Metadata Table
  
  1. New Tables
    - `booking_metadata`
      - `booking_id` (text, primary key) - ID of the booking from external API
      - `viewed_at` (timestamptz) - When admin last viewed/edited the booking
      - `created_at` (timestamptz) - When this record was created
      - `updated_at` (timestamptz) - When this record was updated
  
  2. Security
    - Enable RLS on `booking_metadata` table
    - Add policy for authenticated users (admins) to manage booking metadata
  
  3. Purpose
    - Track which bookings have been viewed/edited by admin
    - Used to determine if "NEW" badge should be shown
    - Separate from external API data for persistence
*/

CREATE TABLE IF NOT EXISTS booking_metadata (
  booking_id text PRIMARY KEY,
  viewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE booking_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read booking metadata"
  ON booking_metadata
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert booking metadata"
  ON booking_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update booking metadata"
  ON booking_metadata
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_booking_metadata_viewed_at ON booking_metadata(viewed_at);
CREATE INDEX IF NOT EXISTS idx_booking_metadata_booking_id ON booking_metadata(booking_id);