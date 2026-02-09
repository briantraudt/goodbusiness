
-- Enable RLS on tables that are missing it
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- admin_users: only accessible via the security definer function check_admin_credentials
-- No direct public access needed
CREATE POLICY "No public access to admin_users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- admin_roles: only admins can view
CREATE POLICY "Admins can view admin_roles"
ON public.admin_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- business_evaluations: allow public insert (for the evaluator form), admin-only read
CREATE POLICY "Anyone can insert business evaluations"
ON public.business_evaluations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view business evaluations"
ON public.business_evaluations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- user_roles: users can read their own role, admins can manage all
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
