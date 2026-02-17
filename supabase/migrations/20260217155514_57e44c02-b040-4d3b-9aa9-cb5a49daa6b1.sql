
-- Storage bucket for class materials
INSERT INTO storage.buckets (id, name, public) VALUES ('class-materials', 'class-materials', true);

-- Storage policies
CREATE POLICY "Professors can upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'class-materials' AND public.has_role(auth.uid(), 'professor')
);

CREATE POLICY "Professors can delete materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'class-materials' AND public.has_role(auth.uid(), 'professor')
);

CREATE POLICY "Anyone authenticated can view materials"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'class-materials');

-- Materials table
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors can insert materials"
ON public.materials FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'professor') AND auth.uid() = uploaded_by);

CREATE POLICY "Professors can delete own materials"
ON public.materials FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'professor') AND auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can view materials"
ON public.materials FOR SELECT
TO authenticated
USING (true);

-- Assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors can insert assignments"
ON public.assignments FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'professor') AND auth.uid() = created_by);

CREATE POLICY "Professors can update own assignments"
ON public.assignments FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'professor') AND auth.uid() = created_by);

CREATE POLICY "Professors can delete own assignments"
ON public.assignments FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'professor') AND auth.uid() = created_by);

CREATE POLICY "Authenticated users can view assignments"
ON public.assignments FOR SELECT
TO authenticated
USING (true);

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions"
ON public.assignment_submissions FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Professors can view all submissions"
ON public.assignment_submissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'professor'));

CREATE POLICY "Students can insert own submissions"
ON public.assignment_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions"
ON public.assignment_submissions FOR UPDATE
TO authenticated
USING (auth.uid() = student_id);
