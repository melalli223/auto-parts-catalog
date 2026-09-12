-- V81: Enquiry CRM fields and admin update policy
ALTER TABLE public.product_enquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New',
  ADD COLUMN IF NOT EXISTS admin_note text;

ALTER TABLE public.product_enquiries
  DROP CONSTRAINT IF EXISTS product_enquiries_status_check;

ALTER TABLE public.product_enquiries
  ADD CONSTRAINT product_enquiries_status_check
  CHECK (status IN ('New','Contacted','Quoted','Sold','Closed'));

DROP POLICY IF EXISTS product_enquiries_admin_update ON public.product_enquiries;
CREATE POLICY product_enquiries_admin_update
ON public.product_enquiries
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

NOTIFY pgrst, 'reload schema';
