
-- Table: student_notes
CREATE TABLE public.student_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  student_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors can insert own notes" ON public.student_notes
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'professor') AND auth.uid() = teacher_id);

CREATE POLICY "Professors can select own notes" ON public.student_notes
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'professor') AND auth.uid() = teacher_id);

CREATE POLICY "Professors can update own notes" ON public.student_notes
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'professor') AND auth.uid() = teacher_id);

CREATE POLICY "Professors can delete own notes" ON public.student_notes
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'professor') AND auth.uid() = teacher_id);

-- Table: student_availability
CREATE TABLE public.student_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  day_of_week int NOT NULL,
  hour int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, day_of_week, hour)
);
ALTER TABLE public.student_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own availability" ON public.student_availability
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Professors can view all availability" ON public.student_availability
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'professor'));

-- Table: material_assignments
CREATE TABLE public.material_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  assigned_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.material_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors can insert assignments" ON public.material_assignments
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'professor') AND auth.uid() = assigned_by);

CREATE POLICY "Professors can delete assignments" ON public.material_assignments
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'professor') AND auth.uid() = assigned_by);

CREATE POLICY "Professors can view all assignments" ON public.material_assignments
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'professor'));

CREATE POLICY "Students can view own assignments" ON public.material_assignments
  FOR SELECT TO authenticated
  USING (auth.uid() = student_id);
