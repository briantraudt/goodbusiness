
-- Create a table to store training bookings
CREATE TABLE public.training_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.training_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (for checking availability)
CREATE POLICY "Allow read access to training bookings" 
  ON public.training_bookings 
  FOR SELECT 
  USING (true);

-- Create policy to allow insert (for new bookings)
CREATE POLICY "Allow insert for training bookings" 
  ON public.training_bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Create unique constraint to prevent double bookings
ALTER TABLE public.training_bookings 
ADD CONSTRAINT unique_booking_slot 
UNIQUE (booking_date, booking_time);
