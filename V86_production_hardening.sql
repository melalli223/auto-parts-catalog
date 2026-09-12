-- V86 production hardening
-- Run this in Supabase SQL Editor before production deployment.
-- No service-role key is required.

-- Public branch images should only expose active category branches.
DROP POLICY IF EXISTS product_branches_public_read ON public.product_branches;
CREATE POLICY product_branches_public_read
ON public.product_branches
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.category_branches cb
    WHERE cb.id = product_branches.branch_id
      AND cb.active = true
  )
);

-- Admins can update enquiry workflow/notes; retain the existing insert/read/delete policies.
DROP POLICY IF EXISTS product_enquiries_admin_update ON public.product_enquiries;
CREATE POLICY product_enquiries_admin_update
ON public.product_enquiries
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

NOTIFY pgrst, 'reload schema';
