
CREATE TABLE public.data_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  reason text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid
);

ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Students can insert their own requests
CREATE POLICY "Users can insert own deletion requests"
  ON public.data_deletion_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Students can view their own requests
CREATE POLICY "Users can select own deletion requests"
  ON public.data_deletion_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can select all deletion requests"
  ON public.data_deletion_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all requests
CREATE POLICY "Admins can update deletion requests"
  ON public.data_deletion_requests FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
