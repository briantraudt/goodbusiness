
-- Create a table for beta signups
CREATE TABLE public.beta_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - making it read-only for security
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert (for the signup form)
CREATE POLICY "Anyone can create beta signups" 
  ON public.beta_signups 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that prevents public reading (only admins should see these)
CREATE POLICY "No public read access to beta signups" 
  ON public.beta_signups 
  FOR SELECT 
  USING (false);
