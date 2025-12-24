-- Add slug column to clients table
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS clients_slug_unique ON public.clients(slug) WHERE slug IS NOT NULL;

-- Update the validate_client_access function to work with slug
CREATE OR REPLACE FUNCTION public.validate_client_access(slug text, code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM clients c
    INNER JOIN client_access ca ON ca.client_id = c.id
    WHERE c.slug = validate_client_access.slug 
    AND ca.access_code = validate_client_access.code
  ) INTO client_exists;
  
  RETURN client_exists;
END;
$$;