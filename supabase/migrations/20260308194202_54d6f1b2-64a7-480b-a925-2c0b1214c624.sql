
-- Create student_management table
CREATE TABLE public.student_management (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  assigned_teacher_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  payment_status text NOT NULL DEFAULT 'pendente',
  payment_due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id)
);

-- Enable RLS
ALTER TABLE public.student_management ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can select student_management"
  ON public.student_management FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert student_management"
  ON public.student_management FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update student_management"
  ON public.student_management FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete student_management"
  ON public.student_management FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER update_student_management_updated_at
  BEFORE UPDATE ON public.student_management
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
