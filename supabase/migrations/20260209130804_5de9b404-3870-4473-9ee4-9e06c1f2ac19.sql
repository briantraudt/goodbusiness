
-- Ensure RLS is enabled on all affected tables (idempotent)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidence_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;

-- ============ admin_users ============
-- Drop existing overly permissive policies if any, then create strict ones
DROP POLICY IF EXISTS "No public access to admin_users" ON public.admin_users;
-- Block direct SELECT; auth goes through check_admin_credentials (security definer)
CREATE POLICY "No direct access to admin_users"
ON public.admin_users FOR SELECT
USING (false);

-- ============ admin_roles ============
DROP POLICY IF EXISTS "Admins can view admin_roles" ON public.admin_roles;
CREATE POLICY "Admins can view admin_roles"
ON public.admin_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ business_evaluations ============
DROP POLICY IF EXISTS "Anyone can insert business evaluations" ON public.business_evaluations;
DROP POLICY IF EXISTS "Admins can view business evaluations" ON public.business_evaluations;
CREATE POLICY "Anyone can insert business evaluations"
ON public.business_evaluations FOR INSERT
WITH CHECK (true);
CREATE POLICY "Admins can view business evaluations"
ON public.business_evaluations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ user_roles ============
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ story_content ============
DROP POLICY IF EXISTS "Allow all operations on story content" ON public.story_content;
CREATE POLICY "Users can manage own story content"
ON public.story_content FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_stories
    WHERE user_stories.id = story_content.story_id
    AND user_stories.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_stories
    WHERE user_stories.id = story_content.story_id
    AND user_stories.user_id = auth.uid()
  )
);

-- ============ training_bookings ============
DROP POLICY IF EXISTS "Allow read access to training bookings" ON public.training_bookings;
CREATE POLICY "Admins can view training bookings"
ON public.training_bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ business_submissions ============
DROP POLICY IF EXISTS "Allow administrators to access all submissions" ON public.business_submissions;
CREATE POLICY "Anyone can submit business ideas"
ON public.business_submissions FOR INSERT
WITH CHECK (true);
CREATE POLICY "Admins can view business submissions"
ON public.business_submissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage business submissions"
ON public.business_submissions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ confidence_adjustments ============
DROP POLICY IF EXISTS "Allow public access to confidence_adjustments" ON public.confidence_adjustments;
CREATE POLICY "Admins can manage confidence adjustments"
ON public.confidence_adjustments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ trade_history ============
DROP POLICY IF EXISTS "Allow public access to trade_history" ON public.trade_history;
CREATE POLICY "Admins can manage trade history"
ON public.trade_history FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
