-- Add cancellation_token column to reservations table
ALTER TABLE reservations 
ADD COLUMN cancellation_token UUID DEFAULT gen_random_uuid(),
ADD CONSTRAINT reservations_cancellation_token_key UNIQUE (cancellation_token);

-- Update existing rows with unique tokens
UPDATE reservations 
SET cancellation_token = gen_random_uuid()
WHERE cancellation_token IS NULL;

-- Make the column required
ALTER TABLE reservations 
ALTER COLUMN cancellation_token SET NOT NULL;

-- Add RLS policies for cancellation_token
CREATE POLICY "Anyone can read reservations using cancellation_token" ON reservations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update their own reservation using cancellation_token" ON reservations
FOR UPDATE
USING (true)
WITH CHECK (status = 'cancelled'); 